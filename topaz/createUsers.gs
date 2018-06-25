
run
  ('SharedReaders' in: AllGroups)
    ifFalse: [AllGroups add: 'SharedReaders' ].
  RowanSample5_userids
  do: [:userId |
  | newUser |
  newUser := AllUsers userWithId: userId ifAbsent: [ nil ].
  newUser
    ifNil: [
      | securityPolicy |
      securityPolicy := GsObjectSecurityPolicy new
	ownerAuthorization: #write;
	group: 'SharedReaders' authorization: #read;
	yourself.
      System commit.
      newUser := AllUsers 
        addNewUserWithId: userId
        password: 'swordfish'
	defaultObjectSecurityPolicy: securityPolicy
        privileges: #('CodeModification'
        'UserPassword'
        'OtherPassword'
        'GarbageCollection'
        'SystemControl'
        'SessionAccess'
        'FileControl'
        'SessionPriority')
        inGroups: #('SharedReaders').
      securityPolicy owner: newUser ].
  System commit ].
%

run
  | symbolList symDicts |
  symbolList := System myUserProfile symbolList.
  symDicts := {}.
  RowanSample5_userids
    do: [:userId |
      | userProfile |
      userProfile := AllUsers userWithId: userId.
 
      GsObjectSecurityPolicy 
	  setCurrent: userProfile defaultObjectSecurityPolicy 
	    while: [
	      #( 1 2 3 ) do: [:index |
              | newDict size session |
              newDict := SymbolDictionary new
                  name: (userId, index printString) asSymbol;
                  objectSecurityPolicy: userProfile defaultObjectSecurityPolicy;
                  yourself.
              symDicts add: newDict.
              size := System myUserProfile symbolList size.
              System myUserProfile insertDictionary: newDict at: size + 1 ] ] ].

  RowanSample5_userids
    do: [:userId |
      symDicts do: [:newDict |
        | size userProfile symbolList |
        userProfile := AllUsers userWithId: userId.
        symbolList := userProfile symbolList.
	GsObjectSecurityPolicy 
	  setCurrent: userProfile defaultObjectSecurityPolicy 
	    while: [
       	      size := symbolList size.
              userProfile insertDictionary: newDict at: size + 1.
	      (userProfile objectNamed: 'UserGlobals')
		at: #rowanCompile put: true. ] ] ].
%
commit

