# Snake_Canvas
Typical snake game made up using Canvas.

I made this with the purpose of learning more about the Canvas usage, it's the typical snake game where you have to eat a fruit and every time
you eat it your length will increase, if you collide with the borders or with your own tail you lose.

You gain +10 points after you eat a fruit, every 50 points the speed of the snake will increase, making it more difficult to achieve the
next level.

Only visible "bugs" I've found are two, one of them is that due to the lack of time I had to make the game and how fast I made it (I spent over 3 days
because I had to learn from tutorials and such) I forgot to add a rule to avoid the snake moving backwards, so when you move backwards afteryou reach a significant length, code will detect you're 
colliding yourself, it's easy to fix, you just have to put such exception in the checkCollision() function.

Second bug is that I haven't managed all the possible exceptions and when you press any key that from your keyboard which is not mapped
in the code game will crash, this is as simple as using the keys that are mapped, I don't think this is a huge problem since you 
SHOULDN'T try another keys that are not the mentioned ones.

Keys and information are all listed up in the game's interface.

Timer was created using albert-gonzalez's EasyTimer library (https://github.com/albert-gonzalez/easytimer.js), very nice tool.

Enjoy!
