# problem: avoid at all cost the execution of npm or bower on launchpad (no network access
# on build farm)
# but 'make install' needs that the bower_components/ subdir is filled
# and thus that 'bower install' has been run
# Solution:
# - bower supplementary target
# - 'dist-hook' target depends on 'bower'
# - 'install' target does NOT depend on 'bower'
# So:
# - to build the distribution, run 'make dist'
# - to install the stuff, run 'make bower; make install'

NPM_INSTALL_FLAGS= --no-color --no-spin --production
BOWER=$(top_builddir)/node_modules/bower/bin/bower
BOWER_INSTALL_FLAGS=--no-color --no-spin
BOWER_TIMESTAMP=.bower_components.timestamp

all-local:
	@echo "WARNING: running 'make all' does not work!!!"
	@echo "To install the bower_components directory, you must run: make bower"
	@echo "This will install bower and the bower_components/ directory"
	@echo "Thus running 'make install' directly does not work."
	@echo "You must first run 'make bower'."
	@echo "This complication is introduced for obscure packaging reasons. See this Makefile.am for explainations."

bower: $(BOWER_TIMESTAMP)
.PHONY: bower

$(BOWER_TIMESTAMP): $(BOWER) $(srcdir)/bower.json
	$(BOWER) install $(BOWER_INSTALL_FLAGS)
	(sleep 1 ; touch $@)

$(BOWER):
	-$(NPM) install $(NPM_INSTALL_FLAGS) bower

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

dist-hook: bower
	cp -r bower_components $(distdir)
