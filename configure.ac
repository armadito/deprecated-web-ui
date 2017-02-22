AC_INIT(armadito-web-ui,0.12.8,fdechelle@teclib.com)
AM_INIT_AUTOMAKE([tar-ustar foreign])

# collect arguments
# debug
AC_ARG_ENABLE([debug],
	AS_HELP_STRING([--enable-debug],[enable debugging @<:@default is yes@:>@]))

# This is needed when the first PKG_CHECK_MODULES call is inside a conditional (not the case here, but who knows)
PKG_PROG_PKG_CONFIG

# checks for programs.
AC_PROG_CC([gcc])
AC_PROG_LIBTOOL

AC_PATH_PROG(NPM, npm)
if test ! -x "$NPM" ; then
   AC_MSG_WARN("cannot find npm")
fi

# check for debug
AC_MSG_CHECKING(for debug)
AC_MSG_RESULT($enable_debug)
AM_CONDITIONAL([DEBUG], [test "$enable_debug" = "yes"])
CFLAGS=
if test "$enable_debug" = "yes"; then
   AC_DEFINE(DEBUG,1,[Define DEBUG to enable debug messages])
   CFLAGS="${CFLAGS} -g"
fi

# httpd part
# check for libmicrohttpd
PKG_CHECK_MODULES(LIBMICROHTTPD, libmicrohttpd, [HAVE_LIBMICROHTTPD=yes], [HAVE_LIBMICROHTTPD=no])
if test "$HAVE_LIBMICROHTTPD" = "no"; then
   AC_MSG_ERROR("cannot find libmicrohttpd library")
fi
# check for libmagic, that has no pkg-config
SAVE_CFLAGS=${CFLAGS}
CFLAGS=-fPIC
AC_CHECK_LIB(magic, magic_open, [HAVE_LIBMAGIC=yes], [HAVE_LIBMAGIC=no])
if test "$HAVE_LIBMAGIC" = "no"; then
   AC_MSG_ERROR("cannot find -lmagic")
fi
CFLAGS=${SAVE_CFLAGS}
unset SAVE_CFLAGS
AC_CHECK_HEADER(magic.h, [HAVE_MAGIC_H=yes], [HAVE_MAGIC_H=no])
if test "$HAVE_MAGIC_H" = "no"; then
   AC_MSG_ERROR("cannot find magic.h")
fi
# check for jansson library (JSON)
PKG_CHECK_MODULES(LIBJANSSON, jansson, [HAVE_LIBJANSSON=yes], [HAVE_LIBJANSSON=no])
if test "$HAVE_LIBJANSSON" = "no"; then
   AC_MSG_ERROR("cannot find jansson library")
fi
# check for glib stuff
PKG_CHECK_MODULES(GLIB2, glib-2.0, [HAVE_GLIB2=yes], [HAVE_GLIB2=no])
if test "$HAVE_GLIB2" = "no"; then
   AC_MSG_ERROR("cannot find glib2 library")
fi
PKG_CHECK_MODULES(GTHREAD2, gthread-2.0, [HAVE_GTHREAD2=yes], [HAVE_GTHREAD2=no])
if test "$HAVE_GTHREAD2" = "no"; then
   AC_MSG_ERROR("cannot find gthread2 library")
fi
# check for g_thread_new/g_thread_create
SAVE_CFLAGS=${CFLAGS}
CFLAGS="${GMODULE2_CFLAGS} ${CFLAGS}"
SAVE_LDFLAGS=${LDFLAGS}
LDFLAGS="${GMODULE2_LIBS} ${LDFLAGS}"
AC_CHECK_LIB([glib-2.0], [g_thread_new],
		      [AC_DEFINE([HAVE_GTHREAD_NEW], [], [Define this if glib has the 'g_thread_new' function])])
AC_CHECK_LIB([glib-2.0], [g_thread_create],
		      [AC_DEFINE([HAVE_GTHREAD_CREATE], [], [Define this if glib has the 'g_thread_create' function])])
AC_CHECK_LIB([glib-2.0], [g_thread_init],
		      [AC_DEFINE([HAVE_GTHREAD_INIT], [], [Define this if glib has the 'g_thread_init' function])])
CFLAGS=${SAVE_CFLAGS}
unset SAVE_CFLAGS
LDFLAGS=${SAVE_LDFLAGS}
unset SAVE_LDFLAGS
# for now, disable deprecations, will need more tests in configure.ac
AC_DEFINE([GLIB_DISABLE_DEPRECATION_WARNINGS], [1], [Disable glib deprecation warnings])

# make symbolic links
AC_CONFIG_LINKS([bower.json:bower.json])

# Output files
AC_CONFIG_FILES([
Makefile
httpd/Makefile
])
AC_OUTPUT
