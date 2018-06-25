
run
  #'RowanSample5_userids'
  do: [:userId |
  | newUser |
  newUser := AllUsers userWithId: userId ifAbsent: [ nil ].
  newUser
    ifNil: [
      (AllUsers 
        addNewUserWithId: userId
        password: 'swordfish')
        addPrivilege: #CodeModification;
        addPrivilege: #UserPassword;
        addPrivilege: #OtherPassword;
        addPrivilege: #GarbageCollection;
        addPrivilege: #SystemControl;
        addPrivilege: #SessionAccess;
        addPrivilege: #FileControl;
        addPrivilege: #SessionPriority;
        addGroup: 'DataCuratorGroup';
        yourself ] ].
%
commit

run
  #'RowanSample5_userids'
    do: [:userId |
      | userProfile symbolList |
      userProfile := AllUsers userWithId: userId.
      System currentObjectSecurityPolicy: userProfile defaultObjectSecurityPolicy.
 
      symbolList := userProfile symbolList.
      #( 1 2 3 ) do: [:index |
        | newDict size session |
        newDict := SymbolDictionary new
            name: (userId, index printString) asSymbol;
            objectSecurityPolicy: symbolList objectSecurityPolicy;
            yourself.
        size := System myUserProfile symbolList size.
        System myUserProfile insertDictionary: newDict at: size + 1 ] ].
%


