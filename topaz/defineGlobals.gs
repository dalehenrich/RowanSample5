
run
  UserGlobals 
    at: #'RowanSample5_userids' 
      put: (Dictionary new
        at: 'dev' put: #('Red' 'Yellow' 'Blue');
        at: 'super' put: #('GlobalsCurator' 'ApplicationCurator' 'UserCurator');
	at: 'private' put: #('Dark');
        yourself);
    yourself.
  UserGlobals 
    at: #'RowanSample5_devUserIds'
    put: 
      (((UserGlobals at: #'RowanSample5_userids') at: 'dev') copy
        addAll: ((UserGlobals at: #'RowanSample5_userids') at: 'private')).
  UserGlobals
    at: #'RowanSample5_ApplicationCurator'
    put:  'ApplicationCurator';
    at: #'RowanSample5_GlobalsCurator'
    put:  'GlobalsCurator';
    at: #'RowanSample5_UserCurator'
    put:  'UserCurator';
  yourself
%
commit

