
run
  Globals 
    at: #'RowanSample5_userids' 
      put: (Dictionary new
        at: 'dev' put: #('Red' 'Yellow' 'Blue');
        at: 'super' put: #('GlobalsCurator' 'ApplicationCurator' 'UserCurator');
	at: 'private' put: #('Dark');
	at: 'gemstone' put: #('SystemUser');
        yourself);
    yourself.
  Globals 
    at: #'RowanSample5_devUserIds'
      put: 
      (((Globals at: #'RowanSample5_userids') at: 'dev') copy
        addAll: ((Globals at: #'RowanSample5_userids') at: 'private');
	yourself).
  Globals
    at: #'RowanSample5_ApplicationCurator'
      put:  'ApplicationCurator';
    at: #'RowanSample5_GlobalsCurator'
      put:  'GlobalsCurator';
    at: #'RowanSample5_UserCurator'
      put:  'UserCurator';
    yourself.
  Globals
    at: #'RowanSample5_ApplicationSymbolDictionaries'
      put: {'<place holder>'};
    yourself
%
commit

