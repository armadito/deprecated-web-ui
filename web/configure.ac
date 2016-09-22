AC_INIT(armadito-gui,0.10.1,fdechelle@teclib.com)
AM_INIT_AUTOMAKE

# checks for programs.
AC_PATH_PROG(NPM, npm)
if test ! -x "$NPM" ; then
   AC_MSG_ERROR("cannot find npm")
fi

# make symbolic links
AC_CONFIG_LINKS([bower.json:bower.json])

# Output files
AC_CONFIG_FILES([
Makefile
])
AC_OUTPUT
