
run
  UserGlobals 
    at: #'RowanSample5_userids' 
      put: (Dictionary new
        at: 'dev' put: #('Red' 'Yellow' 'Blue');
        at: 'super' put: #('Curator');
	at: 'private' put: #('Dark');
        yourself);
    yourself
%
commit

