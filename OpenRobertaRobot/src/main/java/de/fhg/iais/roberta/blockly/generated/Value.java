//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, vhudson-jaxb-ri-2.1-2
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a>
// Any modifications to this file will be lost upon recompilation of the source schema.
// Generated on: 2019.10.31 at 03:23:48 PM MEZ
//

package de.fhg.iais.roberta.blockly.generated;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlType;

/**
 * <p>
 * Java class for value complex type.
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 *
 * <pre>
 * &lt;complexType name="value">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="shadow" type="{http://de.fhg.iais.roberta.blockly}shadow" minOccurs="0"/>
 *         &lt;element name="block" type="{http://de.fhg.iais.roberta.blockly}block" minOccurs="0"/>
 *       &lt;/sequence>
 *       &lt;attribute name="name" use="required" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "value", propOrder = {
    "shadow",
    "block"
})
public class Value {

    protected Shadow shadow;
    protected Block block;
    @XmlAttribute(name = "name", required = true)
    protected String name;

    /**
     * Gets the value of the shadow property.
     *
     * @return possible object is {@link Shadow }
     */
    public Shadow getShadow() {
        return this.shadow;
    }

    /**
     * Sets the value of the shadow property.
     *
     * @param value allowed object is {@link Shadow }
     */
    public void setShadow(Shadow value) {
        this.shadow = value;
    }

    /**
     * Gets the value of the block property.
     *
     * @return possible object is {@link Block }
     */
    public Block getBlock() {
        return this.block;
    }

    /**
     * Sets the value of the block property.
     *
     * @param value allowed object is {@link Block }
     */
    public void setBlock(Block value) {
        this.block = value;
    }

    /**
     * Gets the value of the name property.
     *
     * @return possible object is {@link String }
     */
    public String getName() {
        return this.name;
    }

    /**
     * Sets the value of the name property.
     *
     * @param value allowed object is {@link String }
     */
    public void setName(String value) {
        this.name = value;
    }

}
