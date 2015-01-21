$(document).ready(function($) {
    'use strict';

    var myGram = {
        limit : 0,
        perPage : 10,
        holder  : $('#dropzone'),

        init : function(config) {
            this.config = config;

            var timerId,
                csrftoken = this.getCookie('csrftoken'),
                self = this,
                holder  = $('#dropzone'),
                doc     = $(document);

            $.ajaxSetup({
                crossDomain: false, // obviates need for sameOrigin test
                beforeSend: function(xhr, settings) {
                    if (!self.csrfSafeMethod(settings.type)) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });

            /* Removes default behavior for document
             * on drop event and drag
            */
            doc.on('drop', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });

            doc.on('dragenter', function (e) {
                e.stopPropagation();
                e.preventDefault();
                self.displayDropzone(holder);
            });
            doc.on('dragover', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
            doc.on('dragleave', function(e) {
                e.stopPropagation();
                e.preventDefault();
                self.removeDropzone(holder);
            });

            holder.on('dragenter', function(e) {
                e.stopPropagation();
                e.preventDefault();
                holder.addClass('hover');
                return false;
            });

            holder.on('dragleave', function(e) {
                e.stopPropagation();
                e.preventDefault();
                holder.removeClass('hover');
                self.removeDropzone(holder);
                return false;
            });

            // This is also the upload event
            holder.on('drop', function(e) {
                e.stopPropagation();
                e.preventDefault();
                holder.removeClass('hover');
                var file     = e.originalEvent.dataTransfer.files[0],
                    formData = new FormData();

                formData.append('file', file);

                $.ajax({
                    type: "POST",
                    url: '/api/',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success : function(response) {
                        console.log('Successfully sent');
                        self.status('Successfully uploaded file!')
                    },
                    error : function(xhr, ajaxOptions, thrownError) {

                        console.log("error: " + thrownError);
                    }

                });
                self.removeDropzone(holder);
                return false;
             });

            $(window).scroll(function() {
                var w   = $(window),
                    doc = $(document);
                if (w.scrollTop() == doc.height()-w.height()){
                    self.refresh(10, 10);
                }
            });
        },

        refresh: function (limit, perPage) {
            console.log("Trigged! limit: " + limit);
            this.limit = this.limit + parseInt(limit);
            this.perPage = this.perPage + parseInt(perPage);

            $.ajax({
                url: '/api/' + limit + '/' + perPage,
                type: 'GET',
                Type: 'json',
            })
            .done(function(data) {
                $.each(data, function(i, data) {
                    $('#timeline').append(
                        $('<section>').hide()
                        .append($('<img />').attr({src : data.img})
                        .appendTo($('<a />')
                        .attr({href:data.img})))
                        .append($('<abbr>', {'class': data.time, 'text': jQuery.timeago(data.time)})).fadeIn(1500)
                    );
                });
            })
            .fail(function() {
                $('#timeline').text('Failed to load files');
                console.log("error");
            });
        },

        //Ajax call
        csrfSafeMethod: function (method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        },

        getCookie: function (name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        },

        displayDropzone : function (ele) {
            console.log("displayDropzone: zone är aktive: " + !ele.hasClass('active'));
            if (! ele.hasClass('active')) {
                ele.fadeIn('slow', function () {
                    $(this).addClass('drop-here active');
                });
            }
        },

        removeDropzone : function (ele) {
            console.log("removeDropzone: zone är aktive: " + !ele.hasClass('active'));
            if (ele.hasClass('active')) {
                ele.fadeOut(3000, function () {
                    $(this).removeClass('drop-here active');

                });
            }
        },

        status :  function(message) {

            $('<div class="flashy-success">').text(message).append('#timeline');
        }
    }

    myGram.init();
    myGram.refresh();
    myGram.refresh(10, 10);
});


