/***

Copyright (C) 2015, 2016 Teclib'

This file is part of Armadito gui.

Armadito core is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Armadito core is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with Armadito core.  If not, see <http://www.gnu.org/licenses/>.

***/

#ifndef LINUX_APPINDICATOR_H
#define LINUX_APPINDICATOR_H

#include <gio/gio.h>
#include <gtk/gtk.h>
#include <libappindicator/app-indicator.h>

#define APP_ID "org.armadito.systray"

#define RESOURCES_PATH "/org/armadito/systray"
#define ICONS_RESPATH RESOURCES_PATH "/icons"
#define UI_RESOURCE RESOURCES_PATH "/linux/systray.ui"
#define ICON_RESOURCE ICONS_RESPATH "/" PROGRAM_NAME ".svg"
#define WARNING_ICON_RESOURCE ICONS_RESPATH "/" PROGRAM_NAME "-warning.svg"

#if !DEBUG
#undef g_debug
#define g_debug(...)
#endif

typedef struct _systray_infos systray_infos;

struct _systray_infos {
	GApplication *application;
	AppIndicator *indicator;
	GResource *resources;
};

#endif
