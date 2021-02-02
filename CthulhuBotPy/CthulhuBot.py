prefix = "Cthulhu " # Declare the prefix for the bot

# Imports
import calendar
import datetime
import numpy as np
import difflib
import eel
import sys
import threading
import discord
from discord.ext import commands
from discord.ext.commands import Bot
import asyncio

# Code
intents = discord.Intents().all()
bot = commands.Bot(command_prefix=prefix, intents=intents)		# declare the client (bot) and set its prefix; see beginning of file

global message_to_send			# declare a global variable that will be used to track the message that needs to be sent
message_to_send = ""
global message_channel_id
message_channel_id = ""
global message_sender
message_sender = []

@eel.expose
def update_message(message):	# exposed function; gets triggered on the frontend and updates the global variable with the message passed over from JS
	global message_to_send
	message_to_send = message

@eel.expose
def update_channel_id(channel_id):
	global message_channel_id
	message_channel_id = int(channel_id)

@eel.expose
def update_channel(channel):
	global channel_for_message
	channel_for_message = int(channel)

@eel.expose
def processServerClick(serverId):
	guilds = bot.guilds
	ids = []
	for server in guilds:
		ids.append(int(server.id))
	server_id = ids[min(range(len(ids)), key = lambda i: abs(ids[i]-int(serverId)))] 
	processed_categories_and_channels = []
	temp_array = []
	second_temp_array = []
	for server in guilds:
		if server_id == server.id:
			for category in server.categories:
				if len(temp_array) > 0:
					processed_categories_and_channels.append(temp_array)
					temp_array = []
				for channel in category.channels:
					if bot.user in channel.members:
						if len(temp_array) > 0:
							second_temp_array.append(str(channel.id))
							second_temp_array.append(channel.name)
							temp_array.append(second_temp_array)
							second_temp_array = []
						elif category.id not in temp_array:
							second_temp_array.append(str(category.id))
							second_temp_array.append(category.name)
							temp_array.append(second_temp_array)
							second_temp_array = []
							second_temp_array.append(str(channel.id))
							second_temp_array.append(channel.name)
							temp_array.append(second_temp_array)
							second_temp_array = []
	return processed_categories_and_channels

@eel.expose
def update_member_list(channel_id):
	channel = bot.get_channel(int(channel_id))
	roles = channel.guild.roles
	members = channel.members
	all_member_data = []
	member_data = []
	for role in reversed(roles):
		if role.hoist:
			for member in role.members:
				if member in members:
					# print(str(member.activity))
					member_data.append(str(member.id))
					member_data.append(str(member.display_name))
					member_data.append(str(member.colour))
					member_data.append(str(member.status))
					member_data.append(str(member.avatar_url))
					member_data.append(str(role))
					if member.activity != None:
						activity = member.activity
						emoji_url = ''
						if isinstance(activity, discord.Game):
							name = activity.name
							Type = "Playing "
							Activity = f"{Type}**{name}**"
						elif isinstance(activity, discord.Streaming):
							name2 = activity.name
							name3 = activity.platform
							Type = "Streaming "
							Activity = f"{Type}**{name2} on {name3}**"
						elif isinstance(activity, discord.Spotify):
							name4 = activity.title
							name5 = activity.artists
							Type = "Listening to "
							Activity = f"{Type}**{name4}** by **{name5}**"
						elif isinstance(activity, discord.CustomActivity):
							name6 = activity.name
							Type = "Custom Status"
							Activity = f"{name6}"
							if member.activity.emoji != None:
								emoji_url = member.activity.emoji.url
						else:
							name7 = activity.name
							Type =  "Playing "
							Activity = f"{Type}**{name7}**"

						space = [' ']
						if '***' in Activity:
							ast_3_check = 0
							while '***' in Activity:
								if ast_3_check == 0:
									start = Activity.find('***')
									end = start + 3
									Activity = Activity[:start] + "<em><b>" + Activity[end:]
									ast_3_check = 1
								elif ast_3_check == 1:
									start = Activity.find('***')
									end = start + 3
									Activity = Activity[:start] + "</b></em>" + Activity[end:]
									ast_3_check = 0
						if '**' in Activity:
							ast_3_check = 0
							while '**' in Activity:
								if ast_3_check == 0:
									start = Activity.find('**')
									end = start + 2
									Activity = Activity[:start] + "<b>" + Activity[end:]
									ast_3_check = 1
								elif ast_3_check == 1:
									start = Activity.find('**')
									end = start + 2
									Activity = Activity[:start] + "</b>" + Activity[end:]
									ast_3_check = 0
						if '*' in Activity:
							ast_3_check = 0
							while '*' in Activity:
								if ast_3_check == 0:
									start = Activity.find('*')
									end = start + 1
									Activity = Activity[:start] + "<em>" + Activity[end:]
									ast_3_check = 1
								elif ast_3_check == 1:
									start = Activity.find('*')
									end = start + 1
									Activity = Activity[:start] + "</em>" + Activity[end:]
									ast_3_check = 0
						member_data.append(str(Activity))
						member_data.append(str(emoji_url))
					else:
						member_data.append(0)
					all_member_data.append(member_data)
					member_data = []
	if len(all_member_data) > 0:
		for member in members:
			member_data.append(str(member.id))
			member_data.append(str(member.display_name))
			member_data.append(str(member.colour))
			member_data.append(str(member.status))
			member_data.append(str(member.avatar_url))
			member_data.append(0)
			if member.activity != None:
				activity = member.activity
				emoji_url = ''
				if isinstance(activity, discord.Game):
					name = activity.name
					Type = "Playing "
					Activity = f"{Type}**{name}**"
				elif isinstance(activity, discord.Streaming):
					name2 = activity.name
					name3 = activity.platform
					Type = "Streaming "
					Activity = f"{Type}**{name2} on {name3}**"
				elif isinstance(activity, discord.Spotify):
					name4 = activity.title
					name5 = activity.artists
					Type = "Listening to "
					Activity = f"{Type}**{name4}** by **{name5}**"
				elif isinstance(activity, discord.CustomActivity):
					name6 = activity.name
					Type = "Custom Status"
					Activity = f"{name6}"
					if member.activity.emoji != None:
						emoji_url = member.activity.emoji.url
				else:
					name7 = activity.name
					Type =  "Playing "
					Activity = f"{Type}**{name7}**"
				member_data.append(str(Activity))
				member_data.append(str(emoji_url))
			else:
				member_data.append(0)
			all_member_data.append(member_data)
			member_data = []
	else:
		for member in members:
			member_data.append(str(member.id))
			member_data.append(str(member.display_name))
			member_data.append(str(member.colour))
			member_data.append(str(member.status))
			member_data.append(str(member.avatar_url))
			member_data.append(0)
			if member.activity != None:
				activity = member.activity
				emoji_url = ''
				if isinstance(activity, discord.Game):
					name = activity.name
					Type = "Playing "
					Activity = f"{Type}**{name}**"
				elif isinstance(activity, discord.Streaming):
					name2 = activity.name
					name3 = activity.platform
					Type = "Streaming "
					Activity = f"{Type}**{name2} on {name3}**"
				elif isinstance(activity, discord.Spotify):
					name4 = activity.title
					name5 = str(activity.artists)
					Type = "Listening to "
					Activity = f"{Type}**{name4}** by **{name5}**"
				elif isinstance(activity, discord.CustomActivity):
					name6 = activity.name
					Type = "Custom Status"
					Activity = f"{name6}"
					if member.activity.emoji != None:
						emoji_url = member.activity.emoji.url
				else:
					name7 = activity.name
					Type =  "Playing "
					Activity = f"{Type}**{name7}**"
				member_data.append(str(Activity))
				member_data.append(str(emoji_url))
				# print(Activity)
			else:
				member_data.append(0)
			all_member_data.append(member_data)
			member_data = []
	eel.update_member_list_js(all_member_data)


async def messages_to_see(): 		
	while True:
		global message_channel_id
		if message_channel_id != "" and message_channel_id != None:
			channel = bot.get_channel(int(message_channel_id))
			messages = await channel.history(limit=100).flatten()
			final_message_array = []
			temp_array = []
			for message in messages:
				server = message.guild.id
				guild = bot.get_guild(server)
				members = bot.get_guild(server).members
				for member in members:
					if member.id == message.author.id:
						member_colour = member.colour
						break
					else:
						member_colour = "#000000"
				color = list(np.random.choice(range(256), size=3))
				temp_array.append(str(message.author.id))
				temp_array.append(str(message.id))
				temp_array.append(message.author.display_name)
				colour = "rgb(" + str(color[0]) + "," + str(color[1]) + "," + str(color[2]) + ")"
				temp_array.append(str(member_colour))
				temp_array.append(str(message.author.avatar_url))
				if "<#" in message.content:
					while message.content.find("<#") != -1:
						start = message.content.find("<#")
						end = start + 20
						channel_ = bot.get_channel(int(message.content[start+2:end]))
						channel_name = channel_.name
						message.content = message.content[:start] + "<i class=\"tag tag_channel_name\">#" + channel_name + "</i>" + message.content[end+1:]
				if "<@" in message.content:
					while message.content.find("<@") != -1:
						start = message.content.find("<@")
						if message.content[start+2] == "!":
							end = start + 21
							for member in members:
								if member.id == int(message.content[start+3:end]):
									user_name = member.display_name
							message.content = message.content[:start] + "<i class=\"tag tag_member_name\">@" + user_name + "</i>" + message.content[end+1:]
						elif message.content[start+2] == "&":
							end = start + 21
							role = guild.get_role(int(message.content[start+3:end]))
							role_name = role.name
							colour = role.colour
							message.content = message.content[:start] + "<i id=\"" + str(colour) + "\" class=\"tag tag_role_name\">@" + role_name + "</i>" + message.content[end+1:]
						else:
							end = start + 20
							for member in members:
								if member.id == int(message.content[start+2:end]):
									user_name = member.display_name
							message.content = message.content[:start] + "<i class=\"tag tag_member_name\">@" + user_name + "</i>" + message.content[end+1:]
				if '***' in message.content:
					ast_3_check = 0
					while '***' in message.content:
						if ast_3_check == 0:
							start = message.content.find('***')
							end = start + 3
							message.content = message.content[:start] + "<em><b>" + message.content[end:]
							ast_3_check = 1
						elif ast_3_check == 1:
							start = message.content.find('***')
							end = start + 3
							message.content = message.content[:start] + "</b></em>" + message.content[end:]
							ast_3_check = 0
				if '**' in message.content:
					ast_3_check = 0
					while '**' in message.content:
						if ast_3_check == 0:
							start = message.content.find('**')
							end = start + 2
							message.content = message.content[:start] + "<b>" + message.content[end:]
							ast_3_check = 1
						elif ast_3_check == 1:
							start = message.content.find('**')
							end = start + 2
							message.content = message.content[:start] + "</b>" + message.content[end:]
							ast_3_check = 0
				if '*' in message.content:
					ast_3_check = 0
					while '*' in message.content:
						if ast_3_check == 0:
							start = message.content.find('*')
							end = start + 1
							message.content = message.content[:start] + "<em>" + message.content[end:]
							ast_3_check = 1
						elif ast_3_check == 1:
							start = message.content.find('*')
							end = start + 1
							message.content = message.content[:start] + "</em>" + message.content[end:]
							ast_3_check = 0
				temp_array.append(message.content)
				if len(message.attachments) > 0:
					print(message.attachments)
					temp_array.append(message.attachments)
				else:
					temp_array.append(None)
				if message.created_at.day == datetime.datetime.now().day and message.created_at.year == datetime.datetime.now().year and message.created_at.month == datetime.datetime.now().month:
					hour_var = message.created_at.hour
					minute_var = message.created_at.minute
					if hour_var < 10:
						hour = "0" + str(hour_var)
					else:
						hour = str(hour_var)
					if minute_var < 10:
						minute = "0" + str(minute_var)
					else:
						minute = str(minute_var)
					date = "Today at " + hour + ":" + minute
				elif message.created_at.day == datetime.datetime.now().day - 1:
					hour_var = message.created_at.hour
					minute_var = message.created_at.minute
					if hour_var < 10:
						hour = "0" + str(hour_var)
					else:
						hour = str(hour_var)
					if minute_var < 10:
						minute = "0" + str(minute_var)
					else:
						minute = str(minute_var)
					date = "Yesterday at " + hour + ":" + minute
				elif datetime.datetime.now().day - 1 < 1:
					check = 0
					string_month = str(message.created_at.month)
					string_day = str(message.created_at.day)
					if string_month == "1":
						if string_day == "31":
							check = 1
					elif string_month == "2":
						if calendar.isleap(message.created_at.year):
							if string_day == "29":
								check = 1
						elif string_day == "28":
							check = 1
					elif string_month == "3":
						if string_day == "31":
							check = 1
					elif string_month == "4":
						if string_day == "30":
							check = 1
					elif string_month == "5":
						if string_day == "31":
							check = 1
					elif string_month == "6":
						if string_day == "30":
							check = 1
					elif string_month == "7":
						if string_day == "31":
							check = 1
					elif string_month == "8":
						if string_day == "31":
							check = 1
					elif string_month == "9":
						if string_day == "30":
							check = 1
					elif string_month == "10":
						if string_day == "31":
							check = 1
					elif string_month == "11":
						if string_day == "30":
							check = 1
					elif string_month == "12":
						if string_day == "31":
							check = 1
					if check == 1:
						hour_var = message.created_at.hour
						minute_var = message.created_at.minute
						if hour_var < 10:
							hour = "0" + str(hour_var)
						else:
							hour = str(hour_var)
						if minute_var < 10:
							minute = "0" + str(minute_var)
						else:
							minute = str(minute_var)
						date = "Yesterday at " + hour + ":" + minute
					else:
						date = str(str(message.created_at.year) + "/" + str(message.created_at.month) + "/" + str(message.created_at.day))
				else:
					date = str(str(message.created_at.year) + "/" + str(message.created_at.month) + "/" + str(message.created_at.day))
				temp_array.append(str(date))
				temp_array.append(bot.user.display_name)
				final_message_array.append(temp_array)
				temp_array = []
			eel.send_message_data(final_message_array)
			message_channel_id = ""
		await asyncio.sleep(1)

async def send_message(): # function to keep checking for a new message to send; resets message once sent; non-blocking
	message_to_check = ""
	while True:
		global message_to_send
		global channel_for_message
		if message_to_send != "" and message_to_send != None and message_to_send != message_to_check:
			channel = bot.get_channel(channel_for_message)
			await channel.send(message_to_send)
			message_to_send = ""
			message_to_check = ""
		await asyncio.sleep(.5)

async def update_member_bar():
	await asyncio.sleep(5)
	while True:
		global channel_for_message
		update_member_list(channel_for_message)
		await asyncio.sleep(5)

@bot.event								
async def on_ready():					# function that triggers once the connection with the Discord API is in a "ready" state
	message_loop = bot.loop.create_task(send_message()) # starts a new task, using the current loop; see send_message; will run until app's termination
	bot.loop.create_task(messages_to_see())
	bot.loop.create_task(update_member_bar())
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
	eel.send_js_servers(names,icons,ids)


@bot.event
async def on_message(ctx): 				# triggers every time a new message is sent in a channel the bot has access to
	# print(ctx.content)
	# print(ctx.guild.emojis)
	# for emoji in ctx.guild.emojis:
	# 	print(emoji.url)
	channel_id = str(ctx.channel.id)
	if ctx.author == bot.user:
		scroll = True
	else:
		scroll = False
	if len(ctx.attachments) > 0:
		message_attachments = ctx.attachments
	else:
		message_attachments = None
	color = list(np.random.choice(range(256), size=3))
	colour = "rgb(" + str(color[0]) + "," + str(color[1]) + "," + str(color[2]) + ")"
	members = ctx.guild.members
	member_colour = ctx.author.colour
	hour_var = ctx.created_at.hour
	minute_var = ctx.created_at.minute
	if hour_var < 10:
		hour = "0" + str(hour_var)
	else:
		hour = str(hour_var)
	if minute_var < 10:
		minute = "0" + str(minute_var)
	else:
		minute = str(minute_var)
	date = "Today at " + hour + ":" + minute
	members = ctx.guild.members
	if "<#" in ctx.content:
		while ctx.content.find("<#") != -1:
			start = ctx.content.find("<#")
			end = start + 20
			channel_ = bot.get_channel(int(ctx.content[start+2:end]))
			channel_name = channel_.name
			ctx.content = ctx.content[:start] + "<i class=\"tag tag_channel_name\">#" + channel_name + "</i>" + ctx.content[end+1:]
	if "<@" in ctx.content:
		while ctx.content.find("<@") != -1:
			start = ctx.content.find("<@")
			if ctx.content[start+2] == "!":
				end = start + 21
				for member in members:
					if member.id == int(ctx.content[start+3:end]):
						user_name = member.display_name
				ctx.content = ctx.content[:start] + "<i class=\"tag tag_member_name\">@" + user_name + "</i>" + ctx.content[end+1:]
			elif ctx.content[start+2] == "&":
				end = start + 21
				guild = ctx.guild
				role = guild.get_role(int(ctx.content[start+3:end]))
				role_name = role.name
				ctx.content = ctx.content[:start] + "<i class=\"tag tag_role_name\">@" + role_name + "</i>" + ctx.content[end+1:]
			else:
				end = start + 20
				for member in members:
					if member.id == int(ctx.content[start+2:end]):
						user_name = member.display_name
				ctx.content = ctx.content[:start] + "<i class=\"tag tag_member_name\">@" + user_name + "</i>" + ctx.content[end+1:]
	if '***' in ctx.content:
		ast_3_check = 0
		while '***' in ctx.content:
			if ast_3_check == 0:
				start = ctx.content.find('***')
				end = start + 3
				ctx.content = ctx.content[:start] + "<em><b>" + ctx.content[end:]
				ast_3_check = 1
			elif ast_3_check == 1:
				start = ctx.content.find('***')
				end = start + 3
				ctx.content = ctx.content[:start] + "</b></em>" + ctx.content[end:]
				ast_3_check = 0
	if '**' in ctx.content:
		ast_3_check = 0
		while '**' in ctx.content:
			if ast_3_check == 0:
				start = ctx.content.find('**')
				end = start + 2
				ctx.content = ctx.content[:start] + "<b>" + ctx.content[end:]
				ast_3_check = 1
			elif ast_3_check == 1:
				start = ctx.content.find('**')
				end = start + 2
				ctx.content = ctx.content[:start] + "</b>" + ctx.content[end:]
				ast_3_check = 0
	if '*' in ctx.content:
		ast_3_check = 0
		while '*' in ctx.content:
			if ast_3_check == 0:
				start = ctx.content.find('*')
				end = start + 1
				ctx.content = ctx.content[:start] + "<em>" + ctx.content[end:]
				ast_3_check = 1
			elif ast_3_check == 1:
				start = ctx.content.find('*')
				end = start + 1
				ctx.content = ctx.content[:start] + "</em>" + ctx.content[end:]
				ast_3_check = 0
	message_array = [str(ctx.author.id),str(ctx.id),ctx.author.display_name,str(member_colour),str(ctx.author.avatar_url),ctx.content,channel_id,message_attachments,scroll,str(date),bot.user.display_name]

	eel.new_message(message_array)

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