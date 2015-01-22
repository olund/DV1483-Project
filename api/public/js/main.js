$(document).ready(function($) {
    'use strict';

    window.myGram = {
        limit : 0,
        perPage : 10,
        holder  : $('#dropzone'),

        init : function(config) {
            this.config = config;

            var timerId,
                csrftoken = this.getCookie('csrftoken'),
                self = this,
                holder  = $('#dropzone'),
                doc     = $(document),
                section = $('#timeline'),
                w       = $(window);

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
                holder.find('section h2').text('Drop image here');
            });

            holder.on('dragenter', function(e) {
                e.stopPropagation();
                e.preventDefault();
                holder.addClass('hover');
                holder.find('section h2').text('Release');
                return false;
            });
            holder.on('dragleave', function(e) {
                e.stopPropagation();
                e.preventDefault();
                holder.removeClass('hover');
                return false;
            });

            // This is also the upload event
            holder.on('drop', function(e) {
                e.stopPropagation();
                e.preventDefault();

                holder.removeClass('hover')
                    .find('section h2').text('Uploading...');
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
                        holder.find('section').addClass('dropped');
                        setTimeout(function () {
                            $('section h2').text('Success!');
                        }, 500);
                        setTimeout(function () {
                            self.refresh(1, 1, true);
                        }, 500);
                        setTimeout(function () {
                            holder.fadeOut('slow', function() {
                                $(this).find('section').removeClass('dropped').find('h2').text('Drop image here');
                            });
                        }, 3000);
                    },
                    error : function(xhr, ajaxOptions, thrownError) {
                        console.log("error: " + thrownError);
                        holder.find('section').addClass('dropped-error')
                            .find('h2').text('Failed!');
                    }
                });

                return false;
            });

            w.scroll(function() {
                if (w.scrollTop() == doc.height()-w.height()){
                    self.refresh(10, 10);
                }
            });
        },

        refresh: function (limit, perPage, pretend) {
            var pend = pretend || false;
            this.limit = this.limit + parseInt(limit);
            this.perPage = this.perPage + parseInt(perPage);

            $.ajax({
                url: '/api/' + limit + '/' + perPage,
                type: 'GET',
                Type: 'json',
            })
            .done(function(data) {
                $.each(data, function(i, data) {
                    var ele =  $('<section class="content">').hide()
                            .append($('<img />').attr({src : data.img})
                            .appendTo($('<a />')
                            .attr({href:data.img})))
                            .append($('<abbr>', {'class': data.time, 'text': jQuery.timeago(data.time)})).fadeIn(1500);
                    if (pend === true) {
                        $('#timeline').prepend(ele);
                    } else {
                        $('#timeline').append(ele);
                    }
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
            $("html, body").animate({ scrollTop: 0 }, "slow");
            ele.fadeIn('slow', function () {
                $(this).addClass('drop-here');
            });
        },

        status :  function(message) {
            $('<div class="flashy-success">').text(message).append('#timeline');
        }
    }

    myGram.init();
    myGram.refresh(10, 10);

});


