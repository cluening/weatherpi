#!/usr/bin/python

# Inspired by http://www.kryogenix.org/days/2014/03/03/writing-a-simple-desktop-widget-for-ubuntu/

from gi.repository import WebKit, Gtk, Gdk, Gio, GLib
import signal, sys

class MainWindow(Gtk.Window):
  def __init__(self):
    Gtk.Window.__init__(self)
    self.set_type_hint(Gdk.WindowTypeHint.DOCK)
    #self.fullscreen()
    self.set_size_request(480, 320)

    WebKit.set_cache_model(WebKit.CacheModel.DOCUMENT_VIEWER)
    self.view = WebKit.WebView()
    self.view.connect("close-web-view", self.closehandler)

    box = Gtk.Box()
    self.add(box)
    box.pack_start(self.view, True, True, 0)
    self.connect("destroy", lambda q: Gtk.main_quit())

    self.show_all()
    self.move(0, 0)

  def closehandler(self, widget):
    print("Javascript asked us to quit!")
    Gtk.main_quit()

if __name__ == '__main__':
  mainwindow = MainWindow()
  mainwindow.view.load_uri(sys.argv[1])

  signal.signal(signal.SIGINT, signal.SIG_DFL)

  Gtk.main()

