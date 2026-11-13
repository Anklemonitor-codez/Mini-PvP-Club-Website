import discord
from discord.ext import commands
from discord import app_commands
import requests
import base64
import json
from dotenv import load_dotenv
import os

load_dotenv()

DISCORD_BOT_TOKEN = os.getenv("TOKEN")

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = "Anklemonitor-codez/Mini-PvP-Club-Website"
GITHUB_BRANCH = "main"
JSON_FILE_PATH = "players.json"

intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)

ALLOWED_USER_IDS = [
    1305093833679179836,
    1320581877408600118
]

ADMIN_ROLE_NAME = "admin"
TIER_TESTER_ROLE = "tier tester"

def get_avatar_url(member: discord.Member):
    avatar_url = member.display_avatar.url
    return avatar_url

def capitalizeInput(string):
    upper_string = string.upper()
    return upper_string

def authorized():
    async def predicate(interaction: discord.Interaction):
        # Allow specific users
        if interaction.user.id in ALLOWED_USER_IDS:
            return True

        # Check roles if in a guild
        if isinstance(interaction.user, discord.Member):
            for role in interaction.user.roles:
                if role.name == ADMIN_ROLE_NAME:
                    return True

        return False

    return app_commands.check(predicate)

def is_allowed_messages():
    async def predicate(interaction: discord.Interaction):
        if interaction.user.id in ALLOWED_USER_IDS:
            return True

        if isinstance(interaction.user, discord.Member):
            for role in interaction.user.roles:
                if role.name == ADMIN_ROLE_NAME:
                    return True
                
                if role.name == TIER_TESTER_ROLE:
                    return True

        return False

    return app_commands.check(predicate)

def get_players_json():
    url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{JSON_FILE_PATH}"

    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch JSON: {response.text}")

    data = response.json()

    content = base64.b64decode(data["content"]).decode("utf-8")
    json_data = json.loads(content)

    return json_data, data["sha"]


def update_players_json(updated_json, sha, commit_message):
    url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{JSON_FILE_PATH}"

    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    encoded_content = base64.b64encode(
        json.dumps(updated_json, indent=2).encode("utf-8")
    ).decode("utf-8")

    payload = {
        "message": commit_message,
        "content": encoded_content,
        "sha": sha,
        "branch": GITHUB_BRANCH
    }

    response = requests.put(url, headers=headers, json=payload)

    if response.status_code not in [200, 201]:
        raise Exception(f"Failed to update JSON: {response.text}")

VALID_TIERS = {
    "sword": "Sword",
    "axe": "Axe",
    "uhc": "UHC",
    "vanilla": "Vanilla",
    "mace": "Mace",
    "smp": "SMP",
    "pot": "Diamond_pot",
    "neth-pot": "Netherite_pot"
}      

#app commands

@bot.tree.command(name="tiers", description="Shows a players tiers.")
async def tiers(interaction: discord.Interaction, username: str):
    try:
        players, sha = get_players_json()
        playerTiers = ""
        for player in players:
            if player["Username"].lower() == username.lower():
                playerTiers = player["tiers"]
            
                embed = discord.Embed(title=f"`{username}`'s Tiers 🏆", color=0x22F025)
                embed.add_field(name="Sword", value=f"{playerTiers['Sword']}", inline=False)
                embed.add_field(name="Axe", value=f"{playerTiers['Axe']}", inline=False)
                embed.add_field(name="UHC", value=f"{playerTiers['UHC']}", inline=False)
                embed.add_field(name="Vanilla", value=f"{playerTiers['Vanilla']}", inline=False)
                embed.add_field(name="Mace", value=f"{playerTiers['Mace']}", inline=False)
                embed.add_field(name="SMP", value=f"{playerTiers['SMP']}", inline=False)
                embed.add_field(name="Pot", value=f"{playerTiers['Diamond_pot']}", inline=False)
                embed.add_field(name="Neth Pot", value=f"{playerTiers['Netherite_pot']}", inline=False)
            
                await interaction.response.send_message(embed=embed)

                return

        await interaction.response.send_message(f"Player `{username}` was not found.")

    except Exception as e:
        await interaction.response.send_message(f"Error {e}")   


@bot.tree.command(name="addplayer", description="Adds a player to the leaderboard, only useable by staff.")
@authorized()
async def addplayer(interaction: discord.Interaction, username: str, sword_tier: str, axe_tier: str, uhc_tier: str, vanilla_tier: str, mace_tier: str, smp_tier: str, pot_tier: str, neth_pot_tier: str):
    try:
        players, sha = get_players_json()

        # Check if player already exists
        for player in players:
            if player["Username"].lower() == username.lower():
                await interaction.response.send_message("Player already exists.")
                return

        new_player = {
            "Username": username,
            "tiers": {
                "Sword": capitalizeInput(sword_tier),
                "Diamond_pot": capitalizeInput(pot_tier),
                "Netherite_pot": capitalizeInput(neth_pot_tier),
                "Axe": capitalizeInput(axe_tier),
                "Vanilla": capitalizeInput(vanilla_tier),
                "UHC": capitalizeInput(uhc_tier),
                "Mace": capitalizeInput(mace_tier),
                "SMP": capitalizeInput(smp_tier)
            },
            "Rank": ""
        }

        players.append(new_player)

        update_players_json(
            players,
            sha,
            f"Added player {username}"
        )

        await interaction.response.send_message(f"Added player `{username}` successfully.")

    except Exception as e:
        await interaction.response.send_message(f"Error: {e}")

@bot.tree.command(name="editplayer", description="Edits a players stats on the leaderboard, only useable by staff.")
@authorized()
async def editplayer(interaction: discord.Interaction, username: str, gamemode: str, new_tier: str):
    try:
        new_tier = capitalizeInput(new_tier)
        
        players, sha = get_players_json()

        gamemode = gamemode.lower()

        if gamemode not in VALID_TIERS:
            await interaction.response.send_message(
                "Invalid gamemode.\n"
                "Valid gamemodes: sword, axe, uhc, vanilla, mace, smp, pot, neth-pot"
            )
            return

        actual_tier = VALID_TIERS[gamemode]

        found = False

        for player in players:
            if player["Username"].lower() == username.lower():
                player["tiers"][actual_tier] = new_tier
                found = True
                break

        if not found:
            await interaction.response.send_message("Player not found.")
            return

        update_players_json(
            players,
            sha,
            f"Edited {username}'s {actual_tier} tier"
        )

        await interaction.response.send_message(
            f"Updated `{username}`'s `{actual_tier}` tier to `{new_tier}`."
        )

    except Exception as e:
        await interaction.response.send_message(f"Error: {e}")

@bot.tree.command(name="removeplayer", description="removes a player from the leaderboard, only useable by staff.")
@authorized()
async def removeplayer(interaction: discord.Interaction, username: str):
    try:
        players, sha = get_players_json()

        updated_players = [
            player for player in players
            if player["Username"].lower() != username.lower()
        ]

        if len(updated_players) == len(players):
            await interaction.response.send_message("Player not found.")
            return

        update_players_json(
            updated_players,
            sha,
            f"Removed player {username}"
        )

        await interaction.response.send_message(f"Removed player `{username}` successfully.")

    except Exception as e:
        await interaction.response.send_message(f"Error: {e}")

@bot.tree.command(name="sendresult", description="Sends a result message in the results channel, only useable by staff.")
@is_allowed_messages()
async def sendresult(interaction: discord.Interaction, tester: str, dcusername: str, ign: str, gamemode: str, old_tier: str, new_tier: str):
    try:
        channel_id = 1501577238007648433
        channel = bot.get_channel(channel_id)

        if gamemode not in VALID_TIERS:
            await interaction.response.send_message(
                "Invalid gamemode. \n"
                "Valid gamemodes: sword, axe, uhc, vanilla, mace, smp, pot, neth-pot"
            )
            return

        actual_tier = VALID_TIERS[gamemode]

        if channel:
            member = interaction.guild.get_member_named(dcusername)

            embed = discord.Embed(title=f"{dcusername}'s Test Result 🏆\u2800\u2800", color=0x5CBA45)

            if member:
                pfpurl = member.display_avatar.url
                embed.set_thumbnail(url=pfpurl)
            else:
                await interaction.response.send_message(f"Discord User Not Found")

            embed.add_field(name="Tester", value=f"{tester}", inline=False)
            embed.add_field(name="IGN", value=f"{ign}", inline=False)
            embed.add_field(name="PvP Kit", value=f"{actual_tier}", inline=False)
            embed.add_field(name="Old Tier", value=f"{old_tier}", inline=False)
            embed.add_field(name="Earned Tier", value=f"{new_tier}", inline=False)
            await channel.send(embed=embed)
            await interaction.response.send_message(f"Result message for `{dcusername}`'s `{gamemode}` test has been sent.")
        else:
            print("Channel not found")

    except Exception as e:
        await interaction.response.send_message(f"Error: {e}")

@bot.tree.command(name="sendhighresult", description="Sends a result message in the results channel, only useable by staff.")
@is_allowed_messages()
async def sendhighresult(interaction: discord.Interaction, tester: str, dcusername: str, ign:str, gamemode: str, old_tier: str, new_tier: str):
    try:
        channel_id = 1501577210484621452
        channel = bot.get_channel(channel_id)

        if gamemode not in VALID_TIERS:
            await interaction.response.send_message(
                "Invalid gamemode. \n"
                "Valid gamemodes: sword, axe, uhc, vanilla, mace, smp, pot, neth-pot"
            )
            return

        actual_tier = VALID_TIERS[gamemode]

        if channel:
            member = interaction.guild.get_member_named(dcusername)

            embed = discord.Embed(title=f"{dcusername}'s Test Result 🏆\u2800\u2800", color=0xC79F03)

            if member:
                pfpurl = member.display_avatar.url
                embed.set_thumbnail(url=pfpurl)
            else:
                await interaction.response.send_message(f"Discord User Not Found")

            embed.add_field(name="Tester", value=f"{tester}", inline=False)
            embed.add_field(name="IGN", value=f"{ign}", inline=False)
            embed.add_field(name="PvP Kit", value=f"{actual_tier}", inline=False)
            embed.add_field(name="Old Tier", value=f"{old_tier}", inline=False)
            embed.add_field(name="Earned Tier", value=f"{new_tier}", inline=False)
            await channel.send(embed=embed)
            await interaction.response.send_message(f"Result message for `{dcusername}`'s `{gamemode}` test has been sent.")
        else:
            print("Channel not found")

    except Exception as e:
        await interaction.response.send_message(f"Error: {e}")

@bot.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.CommandNotFound):
        await ctx.send("Command not found.")

    if isinstance(error, commands.CheckFailure):
        await ctx.send("You do not have permission to use this command.")
        return

    raise error

@bot.event
async def on_ready():
    synced = await bot.tree.sync()

    print(f"Synced {len(synced)} commands:")
    for cmd in synced:
        print(f" - {cmd.name}")

    print(f"Logged in as {bot.user}")

@bot.tree.error
async def on_app_command_error(
    interaction: discord.Interaction,
    error: app_commands.AppCommandError
):
    if isinstance(error, app_commands.CheckFailure):
        if not interaction.response.is_done():
            await interaction.response.send_message(
                "You don't have permission to use this command.",
                ephemeral=True
            )
        return

    raise error

bot.run(DISCORD_BOT_TOKEN)