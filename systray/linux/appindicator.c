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

#include <stdlib.h>
#include <assert.h>
#include <string.h>

#include "appindicator.h"
#include "appindicator-resources.h"
#include "../armadito-systray.h"

static void
systray_notification (GApplication *systray_app, const char *title, const char *body)
{
	GNotification *notification;

	g_debug("Notification: %s / %s", title, body);

	notification = g_notification_new (title);
	g_notification_set_body (notification, body);
	g_notification_set_priority (notification, G_NOTIFICATION_PRIORITY_HIGH);
	//g_notification_set_icon (notification, G_ICON (icon));

	g_application_send_notification (systray_app, NULL, notification);

	g_object_unref (notification);
}

G_MODULE_EXPORT void
systray_title ( GtkAction *action, gpointer datas )
{
	systray_infos *systray = ((systray_datas *)datas)->systray;
	g_debug("Systray title selected");

	app_indicator_set_status(systray->indicator, APP_INDICATOR_STATUS_ACTIVE);
}

G_MODULE_EXPORT void
systray_status ( GtkAction *action, gpointer datas )
{
	systray_infos *systray = ((systray_datas *)datas)->systray;
	g_debug("Systray status selected");

	app_indicator_set_status(systray->indicator, APP_INDICATOR_STATUS_ATTENTION);
}

G_MODULE_EXPORT void
systray_toggle ( GtkAction *action, gpointer datas )
{
	systray_infos *systray = ((systray_datas *)datas)->systray;
	g_debug("Systray toggle selected");

	systray_notification(
		systray->application, "TOGGLE", "Toggle menu activated"
	);
}

G_MODULE_EXPORT void
systray_exit ( GtkAction *action, gpointer datas )
{
	systray_infos *systray = ((systray_datas *)datas)->systray;

	g_debug("Systray exit selected");

	g_application_quit(systray->application);
}

static void
shutdown (GApplication *systray_app, gpointer datas)
{
	systray_infos *systray = ((systray_datas *)datas)->systray;
	systray_callback stop_client = ((systray_datas *)datas)->stop_client;

	/* Stop Rest API client before */
	stop_client(datas);

	/* Release some internal refs */
	g_resource_unref(systray->resources);

	g_debug("Shutdown systray");
}

static void
update_visible_status (GApplication *systray_app, gpointer user_data)
{
	systray_datas *datas = (systray_datas *)user_data ;
	AppIndicator *indicator = datas->systray->indicator;

	if (datas->status != ARMADITO_STATUS_NORMAL)
	{
		app_indicator_set_status(indicator, APP_INDICATOR_STATUS_ATTENTION);
	}
	else
	{
		app_indicator_set_status(indicator, APP_INDICATOR_STATUS_ACTIVE);
	}
}

static void
activate (GApplication *systray_app, gpointer datas)
{
	systray_infos *systray = ((systray_datas *)datas)->systray;

	g_debug("Activated systray");
}

static void
startup (GApplication *systray_app, gpointer datas)
{
	systray_infos *systray = ((systray_datas *)datas)->systray;
	systray_callback setup_client = ((systray_datas *)datas)->setup_client;
	GtkBuilder *builder;
	GtkWidget *indicator_menu;
	GResource *resources;
	GtkIconTheme *theme;
	AppIndicator *indicator;
	GError *error = NULL;

	g_debug("Starting systray");

	/* Resources */
	g_debug("Loading resources");
	resources = armadito_systray_get_resource();
	if (!resources)
	{
		g_message("Failed to load resources");
		g_application_quit(systray_app);
		return;
	}

	systray->application = G_APPLICATION (systray_app);
	systray->resources = resources;

	/* Menus */
	g_debug("Loading menus");
#ifdef APPINDICATOR3
	builder = gtk_builder_new_from_resource (UI_RESOURCE);
	if (!builder)
	{
		g_message("Failed to build systray menus");
		g_application_quit(systray_app);
		return;
	}
#else
	{
		GBytes *ui_resource = g_resources_lookup_data( UI_RESOURCE,
			G_RESOURCE_LOOKUP_FLAGS_NONE, &error );
		if (!ui_resource)
		{
			g_message("Failed to load ui resource: %s", error->message);
		} else {
			gsize size = 0;
			const gchar *ui_xml = g_bytes_get_data( ui_resource, &size );
			//g_debug("Loading menus from: %s", ui_xml);
			builder = gtk_builder_new ();
			if (!gtk_builder_add_from_string (builder, ui_xml, size, &error))
			{
				g_message("Failed to build menus: %s", error->message);
			}
			g_bytes_unref(ui_resource);
		}

		if (error)
		{
			g_error_free(error);
			error = NULL;
			g_application_quit(systray_app);
			g_object_unref (builder);
			return;
		}
	}
#endif
	gtk_builder_connect_signals ( builder, datas );

	/* Add resource icons to theme */
#ifdef APPINDICATOR3
	theme = gtk_icon_theme_get_default ();
	gtk_icon_theme_add_resource_path (theme, ICONS_RESPATH);
#else
	{
		// TODO Handle icons size
		GdkPixbuf *systray_icon_pixbuf = gdk_pixbuf_new_from_resource(
			ICON_RESOURCE, &error);
		if (!systray_icon_pixbuf)
		{
			g_message("Failed to load icon resource: %s", error->message);
		} else {
			gtk_icon_theme_add_builtin_icon( PROGRAM_NAME,
				40, systray_icon_pixbuf);
			g_object_unref(systray_icon_pixbuf);
		}

		systray_icon_pixbuf = gdk_pixbuf_new_from_resource(
			WARNING_ICON_RESOURCE, &error);
		if (!systray_icon_pixbuf)
		{
			g_message("Failed to load warning icon resource: %s", error->message);
		} else {
			gtk_icon_theme_add_builtin_icon( PROGRAM_NAME "-warning",
				40, systray_icon_pixbuf);
			g_object_unref(systray_icon_pixbuf);
		}

		if (error)
		{
			g_error_free(error);
			error = NULL;
			g_application_quit(systray_app);
			g_object_unref (builder);
			return;
		}
	}
#endif

#if DEBUG
	{
		GtkIconInfo *icon = gtk_icon_theme_lookup_icon(
		  gtk_icon_theme_get_default (), PROGRAM_NAME, -1,
		  GTK_ICON_LOOKUP_USE_BUILTIN );
		if (!icon)
		{
			g_debug("Icon not found in theme: " PROGRAM_NAME);
		} else {
			g_debug("Icon found in theme: " PROGRAM_NAME);
#ifdef APPINDICATOR3
			g_object_unref (icon);
#else
			gtk_icon_info_free (icon);
#endif
		}
	}
#endif

	/* Indicator */
	g_debug("Starting appindicator");
	indicator = app_indicator_new (
		PRODUCT_NAME " Systray", PROGRAM_NAME,
		APP_INDICATOR_CATEGORY_SYSTEM_SERVICES
	);
	systray->indicator = indicator;

	/* Get popup menu */
	indicator_menu = GTK_WIDGET( gtk_builder_get_object (builder, "systray") );

	/* Setup Rest API client as late as possible */
	setup_client(datas);

	/*  Enable other systray icons */
	app_indicator_set_attention_icon (indicator, PROGRAM_NAME "-warning");

	/* Set systray status */
	update_visible_status( systray->application, datas );

	/* Activate systray menu */
	app_indicator_set_menu (indicator, GTK_MENU (indicator_menu));

	/* Connect important signal handlers */
	g_signal_connect (systray_app, "activate", G_CALLBACK (activate), datas);
	//g_signal_connect (systray_app, "opens", G_CALLBACK (opens), datas);

	g_object_unref (builder);

	/* Finally hold the created systray app for this session */
	g_application_hold (systray->application);

#if DEBUG
	systray_notification(
		systray->application, "Armadito", PROGRAM_NAME " started"
	);
#endif
}

int
launch_systray_app (systray_datas *datas)
{
	int status = 1;

	GApplicationFlags flags =
		G_APPLICATION_IS_SERVICE | G_APPLICATION_HANDLES_OPEN;

#ifdef APPINDICATOR3
	GtkApplication *systray_app;
	systray_app = GTK_APPLICATION ( gtk_application_new ( APP_ID, flags ));
#else
	GApplication *systray_app;
	gtk_init(NULL, NULL);
	systray_app = G_APPLICATION ( g_application_new ( APP_ID, flags ));
#endif

	if (systray_app)
	{
		datas->systray = (systray_infos *)malloc(sizeof(systray_infos));

		/* Initialize signal handlers */
		g_signal_connect (systray_app, "startup", G_CALLBACK (startup), datas);
		g_signal_connect (systray_app, "shutdown", G_CALLBACK (shutdown), datas);

		if (g_application_register( G_APPLICATION (systray_app), NULL, NULL ))
		{

			/* main loop comes here */
			status = g_application_run (G_APPLICATION (systray_app), 0, NULL);
		} else {
			g_message(PROGRAM_NAME " still started");
		}

		/* Lately released resources */
		free(datas->systray);
		g_object_unref (systray_app);
	}

	return status;
}