# problems:
# - avoid at all cost the execution of npm or bower on launchpad
#   because there is no network access on build farm
# - target 'install' needs that the bower_components/ subdir is filled
#   and thus that 'bower install' has been run
# current solution:
# - make everything by hand in target 'all-local'
# - bower_components/ is put into the distribution
# - target 'dist-hook' takes care of that

NPM_INSTALL_FLAGS= --no-color --no-spin --production
BOWER=$(top_builddir)/node_modules/bower/bin/bower
BOWER_INSTALL_FLAGS=--no-color --no-spin
BOWER_TIMESTAMP=.bower_components.timestamp

all-local:
	@do_bower_install() { \
		echo "installing bower & other stuff" ; \
		if test ! -x $(top_builddir)/node_modules/bower/bin/bower ; then \
			$(NPM) install $(NPM_INSTALL_FLAGS) bower;  \
		fi ; \
		$(BOWER) install $(BOWER_INSTALL_FLAGS) ; \
		touch $@ ; \
	} ; \
	if test ! -d bower_components ; then \
		do_bower_install ; \
	elif test -f $(BOWER_TIMESTAMP) ; then \
		if test $(srcdir)/bower.json -nt $(BOWER_TIMESTAMP) ; then \
			do_bower_install ; \
		fi \
	fi

clean-local:
	-rm -rf node_modules bower_components $(BOWER_TIMESTAMP)

webguidir=$(datadir)/armadito

install-data-hook:
	-mkdir -p $(DESTDIR)$(webguidir)
	cp -r bower_components $(DESTDIR)$(webguidir)
	cp -r $(srcdir)/app $(DESTDIR)$(webguidir)

EXTRA_DIST=\
bower.json \
app 

dist-hook: all-local
	cp -r bower_components $(distdir)
