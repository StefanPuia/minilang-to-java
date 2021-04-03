import { Converter } from "./core/converter";

const source = `
<?xml version="1.0" encoding="UTF-8"?>
<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

<simple-methods xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://ofbiz.apache.org/dtds/simple-methods.xsd">

    <simple-method method-name="updateEmplPositionDept" short-description="Update Employee Position And Department">
        <set field="isSame" value="false" type="Boolean" format="" set-if-empty="true"/>
        <set field="isSame" value="false" type="Boolean" format=""/>
        <set field="checkEditReport" value="N"/>
        <set field="checkEditPosition" value="N"/>
        <set field="checkEditHistory" value="N"/>
        <set field="isHaveReportto" value="N"/>
        <set field="hasReason" from-field="parameters.hasReason"/>
        <set field="parameters.basicHoursED" value="\${groovy:com.stannah.base.localization.NumberFormatUtil.getStringFromLocalizedString(context.get(&quot;locale&quot;),parameters.basicHours.toString())}"/>
        <now-timestamp field="nowTimeStamp"/>

        <if-empty field="parameters.positionFromDate">
            <set field="parameters.positionFromDate" value="\${groovy: org.ofbiz.base.util.UtilDateTime.getDayStart(nowTimeStamp)}" type="Timestamp"/>
            <else>
                <set field="isSame" value="false" type="Boolean" format=""/>
            </else>
        </if-empty>
        <if-not-empty field="parameters.positionFromDate">
            <set field="parameters.positionFromDate" value="\${groovy: org.ofbiz.base.util.UtilDateTime.getDayStart(parameters.positionFromDate)}"/>
        </if-not-empty>

        <if-not-empty field="parameters.thruDate">
            <call-class-method class-name="org.ofbiz.base.util.UtilDateTime" method-name="getDayEnd" ret-field="parameters.thruDate">
                <field field="parameters.positionThruDate" type="java.sql.Timestamp"/>
            </call-class-method>
        </if-not-empty>
    </simple-method>
</simple-methods>`;

console.clear();
console.log(Converter.convert(source));
