NPM_INSTALL_FLAGS= --no-color --no-spin --production
BOWER=$(top_builddir)/node_modules/bower/bin/bower
BOWER_INSTALL_FLAGS=--no-color --no-spin

BOWER_TIMESTAMP=.bower_components.timestamp

$(BOWER_TIMESTAMP): $(BOWER) $(srcdir)/bower.json
	$(BOWER) install $(BOWER_INSTALL_FLAGS)
	touch $@

$(BOWER):
	$(NPM) install $(NPM_INSTALL_FLAGS) bower

clean-local:
	-rm -rf node_modules .node_modules.timestamp
	-rm -rf bower_components .bower_components.timestamp

webguidir=$(datadir)/armadito

install-data-hook:
	-mkdir -p $(DESTDIR)$(webguidir)
	cp -r bower_components $(DESTDIR)$(webguidir)
	cp -r $(srcdir)/app $(DESTDIR)$(webguidir)

EXTRA_DIST=\
bower.json \
app 

dist-hook: $(BOWER_TIMESTAMP)
	cp -r bower_components $(distdir)

