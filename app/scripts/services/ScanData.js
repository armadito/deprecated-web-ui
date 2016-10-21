/***

Copyright (C) 2015, 2016 Teclib'

This file is part of Armadito gui.

Armadito gui is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Armadito gui is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Armadito gui.  If not, see <http://www.gnu.org/licenses/>.

***/

'use strict';

/**
 * @ngdoc function
 * @name armaditoApp.controller:InformationController
 * @description
 * # InformationController
 * Controller of the armaditoApp
 */
angular.module('armaditoApp')
  .factory('ScanData',
    function ()
    {
	    return {
	        data:
	        {
                suspicious_count: 0,
                scanned_count: 0,
                malware_count: 0,
                scan_progress: 0,
                progress: 0,
                canceled: 0,
                path_to_scan: "",
                displayed_file: "",
                type: "scan_view.Choose_scan_type",
                files: []
	        },

	        updateCounters: function (scanned_count, suspicious_count, malware_count, progress )
	        {
                this.data.suspicious_count = suspicious_count;
                this.data.scanned_count = scanned_count;
                this.data.malware_count = malware_count;
                this.data.progress = progress;
	        },

	        setDisplayedFile: function (_displayed_file)
	        {
                this.data.displayed_file = _displayed_file;
	        },

	        addScannedFile: function (file_path, file_scan_status, file_scan_action, file_mod_name, file_mod_report)
	        {
                var file = {
		            path: file_path,
		            scan_status: file_scan_status,
		            scan_action: file_scan_action,
                    module_name: file_mod_name,
                    module_report: file_mod_report
	            };

                this.data.files.push(file);
                file = null;
	        },

	        setScanConf: function (path_to_scan, type)
	        {
                this.data.path_to_scan =  path_to_scan;
                this.data.type = type;
	        },

            setCanceled: function ()
            {
                this.data.canceled = 1;
	        },

	        reset: function ()
	        {
                this.data =
                {
                    suspicious_count: 0,
                    scanned_count: 0,
                    malware_count: 0,
                    progress: 0,
                    canceled : 0,
                    path_to_scan: "",
                    displayed_file: "",
                    type: "scan_view.Choose_scan_type",
                    files: []
                };
	        }
	    };
    }
);
