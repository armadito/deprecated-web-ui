AC_INIT(armadito-gui,0.12.0-exp,armadito-av-dev@gna.org,,https://github.com/armadito/armadito-gui)
AM_INIT_AUTOMAKE

# collect arguments
# debug
AC_ARG_ENABLE([debug],
    AS_HELP_STRING([--enable-debug],[enable debugging @<:@default is no@:>@]),
    ,
    enable_debug="no")
# gtk3
AC_ARG_ENABLE([gtk3],
    AS_HELP_STRING([--enable-gtk3],[enable gtk3 support @<:@default is no@:>@]),
    ,
    enable_gtk3="no")

# check for needed programs
AC_PROG_CC([gcc])
AC_PROG_LIBTOOL

# start with clean CFLAGS
CFLAGS=

# check for debug
AC_MSG_CHECKING(for debug)
AC_MSG_RESULT($enable_debug)
AM_CONDITIONAL([DEBUG], [test "$enable_debug" = "yes"])
if test "$enable_debug" = "yes"; then
    AC_DEFINE(DEBUG,1,[Define DEBUG to enable debug messages])
    CFLAGS="${CFLAGS} -g"
fi

PKG_PROG_PKG_CONFIG

# check for libcurl
PKG_CHECK_MODULES(LIBCURL, libcurl, [HAVE_LIBCURL=yes], [HAVE_LIBCURL=no])
if test "$HAVE_LIBCURL" = "no"; then
    AC_MSG_ERROR("cannot find libcurl library")
fi

# check for json-c library
PKG_CHECK_MODULES(LIBJSONC, json-c, [HAVE_LIBJSONC=yes], [HAVE_LIBJSONC=no])
if test "$HAVE_LIBJSONC" = "no"; then
    AC_MSG_ERROR("cannot find json-c library")
fi

# check for glib stuff
PKG_CHECK_MODULES(GLIB2, glib-2.0, [HAVE_GLIB2=yes], [HAVE_GLIB2=no])
if test "$HAVE_GLIB2" = "no"; then
    AC_MSG_ERROR("cannot find glib2 library")
fi
PKG_CHECK_MODULES(GMODULE2, gmodule-2.0, [HAVE_GMODULE2=yes], [HAVE_GMODULE2=no])
if test "$HAVE_GMODULE2" = "no"; then
   AC_MSG_ERROR("cannot find gmodule2 library")
fi
PKG_CHECK_MODULES(GIO2, gio-2.0 gio-unix-2.0, [HAVE_GIO2=yes], [HAVE_GIO2=no])
if test "$HAVE_GIO2" = "no"; then
   AC_MSG_ERROR("cannot find glib gio library")
fi

# check for gtk3
AC_MSG_CHECKING(for using gtk3)
AC_MSG_RESULT($enable_gtk3)
AM_CONDITIONAL([USE_GTK3], [test "$enable_gtk3" = "yes"])
if test "$enable_gtk3" = "yes"; then
  # check for gtk3 stuff
  PKG_CHECK_MODULES(GTK3, gtk+-3.0, [HAVE_GTK3=yes], [HAVE_GTK3=no])
  if test "$HAVE_GTK3" = "no"; then
      AC_MSG_ERROR("cannot find gtk3 library")
  fi

  # check for AppIndicator3
  PKG_CHECK_MODULES(AppIndicator3, appindicator3-0.1, [HAVE_APPINDICATOR3=yes], [HAVE_APPINDICATOR3=no])
  if test "$HAVE_APPINDICATOR2" = "no"; then
    AC_MSG_ERROR("cannot even find AppIndicator3 library")
  fi
  AC_DEFINE(APPINDICATOR3,1,[Define APPINDICATOR3 to enable AppIndicator3 support])
else
  # check for gtk2 stuff
  PKG_CHECK_MODULES(GTK2, gtk+-2.0, [HAVE_GTK2=yes], [HAVE_GTK2=no])
  if test "$HAVE_GTK2" = "no"; then
      AC_MSG_ERROR("cannot find gtk2 library")
  fi

  # check for AppIndicator
  PKG_CHECK_MODULES(AppIndicator, appindicator-0.1, [HAVE_APPINDICATOR=yes], [HAVE_APPINDICATOR=no])
  if test "$HAVE_APPINDICATOR" = "no"; then
    AC_MSG_ERROR(cannot find AppIndicator library)
  fi
  AC_DEFINE(APPINDICATOR,1,[Define APPINDICATOR to enable AppIndicator support])
fi

# Output files
AC_CONFIG_FILES([
Makefile
])
AC_OUTPUT
