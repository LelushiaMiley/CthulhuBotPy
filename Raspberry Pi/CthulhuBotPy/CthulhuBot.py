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
import os
import imageio
import textwrap
import glob
for f in os.listdir("."):
    if not f.endswith(".png"):
        continue
    os.remove(os.path.join(".", f))
# os.remove(os.path.join(msg_id + "", "output.gif"))
from PIL import Image, ImageDraw, ImageFont

# Code
intents = discord.Intents().all()
bot = commands.Bot(command_prefix=prefix, intents=intents)		# declare the client (bot) and set its prefix; see beginning of file

global message_to_send			# declare a global variable that will be used to track the message that needs to be sent
message_to_send = ""
global message_channel_id
message_channel_id = ""
global message_sender
message_sender = []

@bot.event								
async def on_ready():					# function that triggers once the connection with the Discord API is in a "ready" state
	# name = bot.user.name
	print("Logged in as {name}".format(name = bot.user.name))


@bot.event
async def on_message(ctx): # triggers every time a new message is sent in a channel the bot has access to
	if ctx.content.startswith("Cthulhu "):
		content = str(ctx.content[8:])
		if content != "":
			# for a in range(0,10):
			os.mkdir("gif/" + str(ctx.id))
			msg_id = "gif/" + str(ctx.id)
			img = Image.new('RGB', (300,150), color = (255,20,147))
			img.save(msg_id + "/0.png")
			for i in range(1,len(content)+1):
				new_content = content[:i]
				# for a in range(0,10):
				img = Image.new('RGB', (300, 150), color = (255,20,147))
				img_text = ImageDraw.Draw(img)
				unicode_font = ImageFont.truetype("DejaVuSans.ttf")
				img_text.text((10,10), "\n".join(textwrap.wrap(new_content, width=45)), font=unicode_font, fill=(255,255,255))
				filename = msg_id + "/" + str(i) + ".png"
				img.save(filename)
			images = []
			print(sorted(os.listdir(msg_id + "/")))
			img_list = []
			file_list = os.listdir(msg_id + "/")
			for file_ in file_list:
				if file_.endswith('.png'):
					img_list.append(int(file_.replace(".png", "")))
			print(sorted(img_list))
			for filename in sorted(img_list):
				file_path = os.path.join(msg_id + "/", str(filename) + ".png")
				images.append(imageio.imread(file_path))
			# print(images)
			imageio.mimsave(msg_id + "/output.gif", images, "GIF-FI", fps=10)
			for f in os.listdir(msg_id + "/"):
				if not f.endswith(".png"):
					continue
				os.remove(os.path.join(msg_id + "/", f))
			gif = imageio.mimread(msg_id + "/output.gif")
			imageio.mimsave(msg_id + "/output_.gif", gif, 'GIF-FI', fps=60)
			with open(msg_id + "/output.gif", "rb") as f:
				await ctx.channel.send(file=discord.File(f, "output_.gif"))
			# os.remove(os.path.join(msg_id + "/", "output_.gif"))
			# os.remove(os.path.join(msg_id + "/", "output.gif"))
			# os.rmdir(msg_id)

bot.run("NzUwNzU3MDAwMjk5OTM3OTM0.X0_K8Q.MkRx-H5p9mvcKe9hMkxp4U4itjA") # bot's token; will be omitted from GitHub pushes