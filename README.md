# townstar_autosell
simple javascript script to automatically sell items in the townstar browsergame.
original script found on the internet, simplified some parts and added the ability to list many different items (instead of 1).

to use this script install a plugin which allows you to run custom scripts on sites (like Tampermonkey), import the script and change the values as you need them.
Refresh the site where the game runs after you saved the script and enjoy the automatic selling while you sleep.

To add more items into the selling list put them inside the array at line 17 and their minimum amount when it should start selling them into the array at line 18.
If multiple items could sell at the same time the items listed first will take priority.

limitations:
only one type of depot can be set (meaning you cant use the script to sell things via ship AND truck at the same time).
if owning more than one trade depot the script will still try to use the same one every time. but you can use your secondary depot for manual selling on the side without issues.

note:
sometimes when opening the trade menu the game got some loading delay. if this delay is longer than 5 seconds the script wont be able to sell and will output an error into the console.
if this tend to happens a lot to you you might want to increase the click delay inside the script (line 79).
