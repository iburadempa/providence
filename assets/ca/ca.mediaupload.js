/* ----------------------------------------------------------------------
 * js/ca.mediaupload.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2020 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initMediaUploadManager = function(options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			fieldNamePrefix: '',
			uploadURL: null,
			uploadAreaMessage: 'Upload here',
			uploadAreaIndicator: 'Uploading...',
			progressMessage: "Progress: ",
			uploadTotalMessage: "%count uploaded",
			uploadTotalMessageClass: "mediaUploadAreaMessageCount",
			index: 0
		}, options);
		
		jQuery('#' + that.fieldNamePrefix + 'UploadAreaMessage' + that.index).html(that.uploadAreaMessage).on('click', function(e) {
			jQuery('#' + that.fieldNamePrefix + 'UploadFileControl' + that.index).click();
			e.preventDefault();
		});
		jQuery('#' + that.fieldNamePrefix + 'progressbar' + that.index).progressbar({ value: 0 });
		jQuery('#' + that.fieldNamePrefix + 'UploadArea' + that.index).fileupload({
			dataType: 'json',
			url: that.uploadURL,
			dropZone: jQuery('#' + that.fieldNamePrefix + 'UploadArea' + that.index),
			fileInput: jQuery('#' + that.fieldNamePrefix + 'UploadFileControl' + that.index),
			singleFileUploads: false,
			done: function (e, data) {
				if (data.result.error) {
					jQuery('#' + that.fieldNamePrefix + 'ProgressGroup' + that.index).show(250);
					jQuery('#' + that.fieldNamePrefix + 'ProgressStatus' + that.index).html(data.result.error);
					setTimeout(function() {
						jQuery('#' + that.fieldNamePrefix + 'ProgressGroup' + that.index).hide(250);
					}, 3000);
				} else {
					jQuery('#' + that.fieldNamePrefix + 'ProgressStatus' + that.index).html(data.result.msg ? data.result.msg : "");
					setTimeout(function() {
						jQuery('#' + that.fieldNamePrefix + 'ProgressGroup' + that.index).hide(250);
						jQuery('#' + that.fieldNamePrefix + 'UploadArea' + that.index).show(150);
					}, 1500);
				}
				
				var existing_files = jQuery('#' + that.fieldNamePrefix + 'MediaRefs' + that.index).val();
				var files = (existing_files && existing_files.length > 0) ? existing_files.split(";") : [];
				files = files.concat(data.result.files).filter((v, i, a) => a.indexOf(v) === i);	// unique files only
				
				var m = "<div class='" + that.uploadTotalMessageClass + "'>" + that.uploadTotalMessage.replace("%count", files.length) + "</div>";
				jQuery('#' + that.fieldNamePrefix + 'UploadAreaMessage' + that.index).html(that.uploadAreaMessage + ((files.length > 0) ? m : ''));
				jQuery('#' + that.fieldNamePrefix + 'MediaRefs' + that.index).val(files.join(";"));
				
				jQuery('#' + that.fieldNamePrefix + 'UploadCount' + that.index).data('count', files.length);
			},
			progressall: function (e, data) {
				var m = "<div class='" + that.uploadTotalMessageClass + "'>" + that.uploadAreaIndicator.replace("%percent", parseInt(data.loaded / data.total * 100, 10) + "%") + "</div>";
				jQuery('#' + that.fieldNamePrefix + 'UploadAreaMessage' + that.index).html(m);
			}
		});	
		
		// --------------------------------------------------------------------------------
		// Methods
		// --------------------------------------------------------------------------------
		that.openEditor = function(id, primary_id=null) {
			jQuery('#' + that.fieldNamePrefix + '_detail_editor_' + id).slideDown(250);
			jQuery('#' + that.fieldNamePrefix + '_rep_info_ro' + id).slideUp(250);
		};
	
		that.closeEditor = function(id) {
			jQuery('#' + that.fieldNamePrefix + '_detail_editor_' + id).slideUp(250);
			jQuery('#' + that.fieldNamePrefix + '_rep_info_ro' + id).slideDown(250);
			jQuery('#' + that.fieldNamePrefix + '_change_indicator_' + id).show();
		};
	
		that.setAsPrimary = function(id) {
			jQuery('.' + that.fieldNamePrefix + '_is_primary').val('');
			jQuery('#' + that.fieldNamePrefix + '_is_primary_' + id).val('1');
			jQuery('.caObjectRepresentationPrimaryIndicator').hide();
			if (id != primary_id) {
				jQuery('#' + that.fieldNamePrefix + '_is_primary_indicator_' + id).show();
			}
		};
		
		// --------------------------------------------------------------------------------
		
		return that;
	};
})(jQuery);
