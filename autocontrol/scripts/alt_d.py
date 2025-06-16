from time import sleep

from pynput.keyboard import Controller, Key

# open("a.txt", "w").write("")

keyboard = Controller()

# Press and release space
# sleep(0.25)
keyboard.press(Key.alt)
keyboard.press("d")

# sleep(0.25)
keyboard.release(Key.alt)
keyboard.release("d")

print("Done")
