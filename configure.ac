AC_INIT(armadito-web-ui,0.12.7,fdechelle@teclib.com)
AM_INIT_AUTOMAKE([tar-ustar foreign])

# checks for programs.
AC_PATH_PROG(NPM, npm)
if test ! -x "$NPM" ; then
   AC_MSG_WARN("cannot find npm")
fi

# make symbolic links
AC_CONFIG_LINKS([bower.json:bower.json])

# Output files
AC_CONFIG_FILES([
Makefile
])
AC_OUTPUT
