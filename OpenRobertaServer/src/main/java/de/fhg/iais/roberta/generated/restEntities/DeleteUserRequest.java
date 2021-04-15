/*
 * This is a class GENERATED by the TransportGenerator maven plugin. DON'T MODIFY IT.
 * IF you modify it, your work may be lost: the class will be overwritten automatically
 * when the maven plugin is re-executed for any reasons.
 */
package de.fhg.iais.roberta.generated.restEntities;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * the request description for the /deleteUser REST request<br>
 * <br>
 * Version: 1<br>
 * Datum: 2020-06-15
 */
public class DeleteUserRequest extends BaseRequest {
    protected String accountName;
    protected String password;

    /**
     * the request description for the /deleteUser REST request
     */
    public static DeleteUserRequest make() {
        return new DeleteUserRequest();
    }

    /**
     * the request description for the /deleteUser REST request
     */
    public static DeleteUserRequest makeFromString(String jsonS) {
        try {
            JSONObject jsonO = new JSONObject(jsonS);
            return make(jsonO);
        } catch ( JSONException e ) {
            throw new RuntimeException("JSON parse error when parsing: " + jsonS, e);
        }
    }

    /**
     * the request description for the /deleteUser REST request
     */
    public static DeleteUserRequest makeFromProperties(String cmd, String accountName, String password) {
        DeleteUserRequest entity = new DeleteUserRequest();
        entity.setCmd(cmd);
        entity.setAccountName(accountName);
        entity.setPassword(password);
        entity.immutable();
        return entity;
    }

    /**
     * the request description for the /deleteUser REST request
     */
    public static DeleteUserRequest make(JSONObject jsonO) {
        return make().merge(jsonO).immutable();
    }

    /**
     * merge the properties of a JSON-object into this bean. The bean must be "under construction". The keys of the JSON-Object must be valid. The bean remains
     * "under construction".<br>
     * Throws a runtime exception if inconsistencies are detected.
     */
    @Override
    public DeleteUserRequest merge(JSONObject jsonO) {
        try {
            for ( String key : JSONObject.getNames(jsonO) ) {
                if ( "_version".equals(key) ) {
                } else if ( "cmd".equals(key) ) {
                    setCmd(jsonO.optString(key));
                } else if ( "accountName".equals(key) ) {
                    setAccountName(jsonO.getString(key));
                } else if ( "password".equals(key) ) {
                    setPassword(jsonO.getString(key));
                } else {
                    throw new RuntimeException("JSON parse error. Found invalid key: " + key + " in " + jsonO);
                }
            }
            return this;
        } catch ( Exception e ) {
            throw new RuntimeException("JSON parse / casting error when parsing: " + jsonO, e);
        }
    }

    /**
     * moves a bean from state "under construction" to state "immutable".<br>
     * Checks whether all required fields are set. All lists are made immutable.<br>
     * Throws a runtime exception if inconsistencies are detected.
     */
    @Override
    public DeleteUserRequest immutable() {
        if ( this.immutable ) {
            return this;
        }
        this.immutable = true;
        return validate();
    }

    /**
     * Checks whether all required fields are set.<br>
     * Throws a runtime exception if inconsistencies are detected.
     */
    private DeleteUserRequest validate() {
        String _message = null;
        if ( !this.immutable ) {
            _message = "DeleteUserRequest-object is already immutable: " + toString();
        }
        if ( this.accountName == null ) {
            _message = "required property accountName of DeleteUserRequest-object is not set: " + toString();
        }
        if ( this.password == null ) {
            _message = "required property password of DeleteUserRequest-object is not set: " + toString();
        }
        if ( _message != null ) {
            this.immutable = false;
            throw new RuntimeException(_message);
        }
        return this;
    }

    /**
     * GET accountName. Object must be immutable. Never return null or an undefined/default value.
     */
    public String getAccountName() {
        if ( !this.immutable ) {
            throw new RuntimeException("no accountName from an object under construction: " + toString());
        }
        return this.accountName;
    }

    /**
     * SET accountName. Object must be mutable.
     */
    public DeleteUserRequest setAccountName(String accountName) {
        if ( this.immutable ) {
            throw new RuntimeException("accountName assigned to an immutable object: " + toString());
        }
        this.accountName = accountName;
        return this;
    }

    /**
     * GET password. Object must be immutable. Never return null or an undefined/default value.
     */
    public String getPassword() {
        if ( !this.immutable ) {
            throw new RuntimeException("no password from an object under construction: " + toString());
        }
        return this.password;
    }

    /**
     * SET password. Object must be mutable.
     */
    public DeleteUserRequest setPassword(String password) {
        if ( this.immutable ) {
            throw new RuntimeException("password assigned to an immutable object: " + toString());
        }
        this.password = password;
        return this;
    }

    /**
     * generates a JSON-object from an immutable bean.<br>
     * Throws a runtime exception if inconsistencies are detected.
     */
    @Override
    public JSONObject toJson() {
        if ( !this.immutable ) {
            throw new RuntimeException("no JSON from an object under construction: " + toString());
        }
        JSONObject jsonO = new JSONObject();
        try {
            jsonO.put("_version", "1");
            if ( this.cmd != null ) {
                jsonO.put("cmd", this.cmd);
            }
            jsonO.put("accountName", this.accountName);
            jsonO.put("password", this.password);
        } catch ( JSONException e ) {
            throw new RuntimeException("JSON unparse error when unparsing: " + this, e);
        }
        return jsonO;
    }

    @Override
    public String toString() {
        return "DeleteUserRequest [immutable="
            + this.immutable
            + ", cmd="
            + this.cmd
            + ", accountName="
            + this.accountName
            + ", password="
            + this.password
            + " ]";
    }

    @Override
    public int hashCode() {
        throw new RuntimeException("no hashCode from transport beans!");
    }

    @Override
    public boolean equals(Object obj) {
        throw new RuntimeException("no equals from transport beans!");
    }

}
