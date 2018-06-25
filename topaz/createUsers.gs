
run
  RowanSample5_userids
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
        yourself ].
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
      System currentObjectSecurityPolicy: userProfile defaultObjectSecurityPolicy.
 
      #( 1 2 3 ) do: [:index |
        | newDict size session |
        newDict := SymbolDictionary new
            name: (userId, index printString) asSymbol;
            objectSecurityPolicy: symbolList objectSecurityPolicy;
            yourself.
        symDicts add: newDict.
        size := System myUserProfile symbolList size.
        System myUserProfile insertDictionary: newDict at: size + 1 ] ].
  RowanSample5_userids
    do: [:userId |
      symDicts do: [:newDict |
        | size userProfile symbolList |
        userProfile := AllUsers userWithId: userId.
        symbolList := userProfile symbolList.
        System currentObjectSecurityPolicy: userProfile defaultObjectSecurityPolicy.
        size := symbolList size.
        userProfile insertDictionary: newDict at: size + 1 ] ].
   System currentObjectSecurityPolicy: System myUserProfile defaultObjectSecurityPolicy.
%
commit

