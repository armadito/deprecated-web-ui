NPM_INSTALL_FLAGS= --no-color --no-spin --production
BOWER=$(top_builddir)/node_modules/bower/bin/bower
BOWER_INSTALL_FLAGS=--no-color --no-spin

noinst_DATA=.node_modules.timestamp .bower_components.timestamp

.node_modules.timestamp: $(srcdir)/package.json
	$(NPM) install $(NPM_INSTALL_FLAGS)
	touch $@

.bower_components.timestamp: $(BOWER) $(srcdir)/bower.json
	$(BOWER) install $(BOWER_INSTALL_FLAGS)
	touch $@

$(BOWER):
	$(NPM) install $(NPM_INSTALL_FLAGS) bower

clean-local: clean-local-node clean-local-bower
.PHONY: clean-local-node clean-local-bower

clean-local-node:
	-rm -rf node_modules .node_modules.timestamp

clean-local-bower:
	-rm -rf bower_components .bower_components.timestamp

webguidir=$(datadir)/armadito
#??? still needed? gui_DATA=package.json bower.json 

install-data-hook:
	cp -r bower_components $(webguidir)
	cp -r $(srcdir)/app $(webguidir)

EXTRA_DIST=\
bower.json \
app 

dist-hook: $(noinst_DATA)
	cp -r bower_components $(distdir)

