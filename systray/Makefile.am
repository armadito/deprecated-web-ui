AUTOMAKE_OPTIONS=subdir-objects

bin_PROGRAMS= armadito-systray

AM_CFLAGS= @LIBCURL_CFLAGS@ @LIBJSONC_CFLAGS@ @GLIB2_CFLAGS@ @GMODULE2_CFLAGS@ @GIO2_CFLAGS@ -I$(builddir)/linux
LIBS     = @LIBCURL_LIBS@ @LIBJSONC_LIBS@ @GLIB2_LIBS@ @GMODULE2_LIBS@ @GIO2_LIBS@

armadito_systray_CFLAGS= $(AM_CFLAGS)
if USE_GTK3
armadito_systray_CFLAGS+= $(GTK3_CFLAGS) $(AppIndicator3_CFLAGS)
LIBS+= $(GTK3_LIBS) $(AppIndicator3_LIBS)
else
armadito_systray_CFLAGS+= $(GTK2_CFLAGS) $(AppIndicator_CFLAGS)
LIBS+= $(GTK2_LIBS) $(AppIndicator_LIBS)
endif

COMMON_SOURCES= apiclient.c apiclient.h jutil.c jutil.h

nodist_armadito_systray_SOURCES = \
	linux/appindicator-resources.h \
	linux/appindicator-resources.c

armadito_systray_SOURCES = \
	armadito-systray.h \
	armadito-systray.c \
	linux/appindicator.h \
	linux/appindicator.c \
	$(COMMON_SOURCES)

UI_RESOURCES = \
	$(srcdir)/linux/appindicator.gresource.xml \
	$(srcdir)/linux/systray.ui \
	$(srcdir)/icons/armadito-systray.svg \
	$(srcdir)/icons/armadito-systray-warning.svg

desktopdir = $(datadir)/applications
desktop_DATA = org.armadito.systray.desktop

BUILT_SOURCES = $(nodist_armadito_systray_SOURCES)
CLEANFILES = $(nodist_armadito_systray_SOURCES)

GLIB_COMPILE_RESOURCES=glib-compile-resources --sourcedir=$(srcdir) --internal --c-name armadito_systray

linux/appindicator-resources.c: Makefile $(UI_RESOURCES)
	$(GLIB_COMPILE_RESOURCES) --generate-source --target=$@ $(srcdir)/linux/appindicator.gresource.xml

linux/appindicator-resources.h: Makefile $(UI_RESOURCES)
	$(GLIB_COMPILE_RESOURCES) --generate-header --target=$@ $(srcdir)/linux/appindicator.gresource.xml 
