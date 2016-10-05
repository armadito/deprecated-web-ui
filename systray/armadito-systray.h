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

#ifndef ARMADITO_SYSTRAY_H
#define ARMADITO_SYSTRAY_H

#define DEFAULT_PORT          8888
#define S_DEFAULT_PORT        "8888"

#define PRODUCT_NAME "Armadito"
#define PROGRAM_NAME "armadito-systray"
#define PROGRAM_VERSION PACKAGE_VERSION

#if defined(APPINDICATOR) || defined(APPINDICATOR3)
#include "linux/appindicator.h"
#endif

typedef enum {
	ARMADITO_STATUS_NORMAL               = 0,
	ARMADITO_STATUS_NOT_REGISTERED       = 1 << 0,
	ARMADITO_STATUS_NO_DAEMON            = 1 << 1,
	ARMADITO_STATUS_DAEMON_EVENT_FAILURE = 1 << 2
} ArmaditoDaemonStatus;

typedef struct _systray_datas systray_datas;

typedef void (*systray_callback)( systray_datas * );

struct _systray_datas {
	/* Systray options */
	unsigned short port;
	int verbose;
	int debug;

	/* Armadito REST api client */
	systray_callback setup_client;
	systray_callback stop_client;
	struct api_client *client;
	ArmaditoDaemonStatus status;
	const char *error;

	/* Systray infos */
	systray_infos *systray;
};

int launch_systray_app(systray_datas *datas);

#endif
