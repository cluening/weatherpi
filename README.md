# WeatherPi

A set of scripts and web hackery meant to show the current time and weather on a touchscreen-enabled Raspberry Pi.

## Installation hints

 - I used a 4dPi 3.5 inch screen for mine.  Getting that set up is just a matter of following 4dPi's installation instructions.
 - The touchscreen wasn't working for me on boot, so I disabled the ``ar1020-i2c`` module in ``/etc/modules-load.d`` and enabled ``4dpi_touch`` in the same file.
 - To hide the pointer and start the client at boot, I added two lines to ``~pi/.config/lxsession/LXDE-pi/autostart``:
   - ``unclutter -idle 0``
   - ``/home/pi/projects/weatherpi/client/weatherpi-widget.py http://www.wirelesscouch.net/weatherpi/``
 - To prevent the screen from blanking, I added the following to the ``[SeatDefaults]`` section of ``/etc/lightdm/lightdm.conf``:
   - ``xserver-command=X -s 0 -dpms``

Some useful packages for making everything work:

 - ``apt-get install gir1.2-webkit-3.0``
 - ``apt-get install matchbox-keyboard``
 - ``apt-get install unclutter``

Also, don't forget to fix your timezone!

 - ``dpkg-reconfigure tzdata``

And if you are using the official 7 inch touchscreen display, you might want to change the brightness.  This is a nice setting on mine:

 - ``echo 128 > /sys/class/backlight/rpi_backlight/brightness``
