prefix = "Cthulhu " # Declare the prefix for the bot

# Imports

import eel
import sys
import threading
import discord
from discord.ext import commands
from discord.ext.commands import Bot
import asyncio

# Code

bot = commands.Bot(command_prefix=prefix)		# declare the client (bot) and set its prefix; see beginning of file

global message_to_send			# declare a global variable that will be used to track the message that needs to be sent
message_to_send = ""

@eel.expose
def update_message(message):	# exposed function; gets triggered on the frontend and updates the global variable with the message passed over from JS
	global message_to_send
	message_to_send = message

async def send_message(channel): 		# function to keep checking for a new message to send; resets message once sent; non-blocking
	while True:
		global message_to_send
		if message_to_send != "" and message_to_send != None:
			await channel.send(message_to_send)
			message_to_send = ""
		await asyncio.sleep(1)

@bot.event								
async def on_ready():					# function that triggers once the connection with the Discord API is in a "ready" state
	channel_id = bot.guilds[2].text_channels[0].id
	channel = bot.get_channel(ID)
	bot.loop.create_task(send_message(channel)) # starts a new task, using the current loop; see send_message; will run until app's termination
	guilds_bot_can_see = bot.guilds
	names = []
	icons = []
	ids = []
	for server in guilds_bot_can_see:
		ids.append(server.id)
		if server.icon == None:
			icons.append(None)
		else:
			server_icon = "https://cdn.discordapp.com/icons/" + str(server.id) + "/" + (server.icon) + ".png"
			icons.append(server_icon)
		names.append(server.name)
	print(names,icons,ids)
	# eel.send_js_servers(names[0])
	eel.send_js_servers(names,icons,ids)


@bot.event
async def on_message(ctx): 				# triggers every time a new message is sent in a channel the bot has access to
	print(ctx.content)

def runClient():
    bot.run("TOKEN") # bot's token; will be omitted from GitHub pushes

threading.Thread(target=runClient).start()			# starts a thread for the bot as it doesn't seem to get along with Eel otherwise

eel.init('web')		# declares the directory for frontend files; for Eel

@eel.expose
def sys_exit():		# broken function; exposed through Eel; meant to terminate the program when triggered
	sys.exit()

@eel.expose                         
def say_hello_py(x):		# a test function that is exposed with Eel
    print('Hello from %s' % x)

say_hello_py('Python World!')
eel.say_hello_js('Python World!')   	# pylint will show an error, but it can be ignored

"""
	BELOW ARE INITIALISATIONS FOR FILES SO THAT ELECTRON CAN THEN ACCESS THEM FROM THE LOCALHOST
"""
eel.start('loading.html', mode='custom', cmdline_args=['node_modules/electron/dist/electron.exe', '.'])
eel.start('index.html', mode='custom', cmdline_args=['node_modules/electron/dist/electron.exe', '.'])