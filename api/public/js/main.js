$(document).ready(function($) {
    'use strict';


    var myGram = {
        limit : 0,
        perPage : 10,
        startLoadPos: 2000,
        current : 0,

        init : function(config) {
            this.config = config;

            var timerId,
                csrftoken = this.getCookie('csrftoken'),
                self = this;

            $.ajaxSetup({
                crossDomain: false, // obviates need for sameOrigin test
                beforeSend: function(xhr, settings) {
                    if (!self.csrfSafeMethod(settings.type)) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });

            $('#uploadForm').submit(function() {
                self.status('Uploading the file ...');

                $(this).ajaxSubmit({
                    error: function(xhr) {
                        self.status('Error: ' + xhr.status);
                    },

                    success: function(response) {
                        if(response.error) {
                            self.status('Opps, something bad happened');
                            return;
                        }

                        var imageUrlOnServer = response.path;
                        self.status('Success, file uploaded to:' + imageUrlOnServer);
                        $('#uploadForm').trigger("reset");
                    }
                });

                // Have to stop the form from submitting and causing
                // a page refresh - don't forget
                return false;
            });
            // Check to see when a user has selected a file
            timerId = setInterval(function() {
                if($('#userPhotoInput').val() !== '') {
                    clearInterval(timerId);
                    $('#uploadForm').submit();
                }
            }, 500);

            $('[data-dismiss="modal"').on('click', function(e) {
                self.status("");
            });
            // Adds an eventlisterner for loading new images from rest api
            $(window).on('scroll', function(event) {
                event.preventDefault();
                var yScrollPos = window.pageYOffset,
                    magicNumber = 1000;
                console.log(yScrollPos);
                if (yScrollPos > self.current) {
                    self.refresh(this.limit, 10);
                    self.current += self.startLoadPos + magicNumber;
                    console.log(self.current);
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
                    var ele = $('<div>', {'class': 'timeline-container'}).hide().append(
                        $('<div>', {'class': 'timeline-left col-md-4'}).append(
                            $('<p>', {text: data.time})
                        )
                        .append($('<p>', {'class': 'timline-user', 'text': data.username}))
                    )
                    .append(
                        $('<div>', {'class': 'timeline-right col-md-8'}).append(
                            $('<div>', {'class': 'timeline-inner'}).append(
                                    $('<img>').attr('src', data.img)
                                    .addClass('timeline-img')
                                )
                        )
                    ).fadeIn("slow")
                    $('#timeline').append(ele);

                });
            })
            .fail(function() {
                $('#timeline').text('Failed to load files');
                console.log("error");
            });
            console.log(parseInt(this.limit));
        },

        status :  function(message) {
            console.log(message);
            $('#status').text(message);
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
        }
    }

    myGram.init();
    myGram.refresh();
    myGram.refresh(10, 10);
});


