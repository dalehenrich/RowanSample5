
run
  (AllGroups includes: 'GlobalsModificationGroup')
    ifFalse: [AllGroups add: 'GlobalsModificationGroup' ].
  SystemObjectSecurityPolicy group: 'GlobalsModificationGroup' authorization: #write.
  System commitTransaction.
%

run
  RowanSample5_userids
  keysAndValuesDo: [:userCat :userIdList |
    userIdList do: [:userId |
      | newUser |
      newUser := AllUsers userWithId: userId ifAbsent: [ nil ].
      newUser
        ifNil: [
          | securityPolicy worldAuthorization groups |
          worldAuthorization := #read.
          userCat = 'private' ifTrue: [ worldAuthorization := #none ].
          securityPolicy := GsObjectSecurityPolicy new
	    ownerAuthorization: #write;
	    worldAuthorization: worldAuthorization;
	    yourself.
          System commit.
          groups := userCat = 'super'
            ifTrue: [ #('GlobalsModificationGroup') ]
            ifFalse: [ #() ].
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
	    inGroups: groups.
          securityPolicy owner: newUser ].
      System commit ] ].
%

run
  | devSymDicts privateSymDicts |
  devSymDicts := {}.
  privateSymDicts := {}.
  RowanSample5_userids
  keysAndValuesDo: [:userCat :userIdList |
    userCat ~= 'super' ifTrue: [
    "super users do not have their own symbol dictionaries"
    userIdList
    do: [:userId |
      | userProfile symbolList |
      userProfile := AllUsers userWithId: userId.
      symbolList := userProfile symbolList.
      GsObjectSecurityPolicy 
	  setCurrent: userProfile defaultObjectSecurityPolicy 
	    while: [
	      #( 1 2 3 ) do: [:index |
              | newDict session |
              newDict := SymbolDictionary new
                  name: (userId, index printString) asSymbol;
                  objectSecurityPolicy: userProfile defaultObjectSecurityPolicy;
                  yourself.
              userCat = 'dev'
                ifTrue: [ devSymDicts add: newDict ].
              userCat = 'private'
                ifTrue: [ privateSymDicts add: newDict ] ] ] ] ] ].

  RowanSample5_userids
  keysAndValuesDo: [:userCat :userIdList |
   userIdList do: [:userId |
      | userProfile symbolList symDicts |
      "Needed to be able to use Jadeite ... in the short term"
      userProfile := AllUsers userWithId: userId.
      (userProfile objectNamed: 'UserGlobals')
        at: #rowanCompile put: true.
      "all users get the sharedSymbolDicts added to their list"
      symbolList := userProfile symbolList.
      symDicts := devSymDicts.
      userCat = 'super'
        ifTrue: [ 
          symDicts := devSymDicts copy.
          symDicts addAll: privateSymDicts ].
      GsObjectSecurityPolicy 
        setCurrent: userProfile defaultObjectSecurityPolicy 
        while: [
          symDicts do: [:newDict |
            | size  |
       	    size := symbolList size.
              userProfile insertDictionary: newDict at: size + 1 ] ] ] ].
%
commit

