
run
  | allUserIds |
  UserGlobals 
    at: #'RowanSample5_userids' 
      put: (Dictionary new
        at: 'dev' put: #('Red' 'Yellow' 'Blue');
        at: 'super' put: #('GlobalsCurator' 'ApplicationCurator');
	at: 'private' put: #('Dark');
        yourself);
    yourself.
  allUserIds := {}.
  (UserGlobals at: #'RowanSample5_userids') values do: [:each | allUserIds addAll: each ].
  UserGlobals 
    at: #'RowanSample5_allUserIds'
    put: allUserIds.
%
commit

