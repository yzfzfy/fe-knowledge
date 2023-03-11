import React, { forwardRef, useImperativeHandle } from "react";
import { Form, Input, Select, Switch } from "antd";
import type { IModalContentProps } from "./types";

export default forwardRef(function EditModalContent(
    props: IModalContentProps,
    ref
) {
    const { mode } = props;
    const [form] = Form.useForm();

    const formSubmit = async () => {
        const values = await form.validateFields();

        // ...

        return values;
    };

    useImperativeHandle(ref, () => ({
        getValues: formSubmit,
    }));

    function formValueChange(changedValues, allValues) {}

    return (
        <Form
            className="dict-edit-modal-content-form"
            name="modal-form"
            labelCol={{
                span: 6,
            }}
            wrapperCol={{
                span: 12,
            }}
            form={form}
            onValuesChange={formValueChange}
            disabled={mode === "view"}
        >
            <Form.Item label="字段" name="field_1">
                <Input />
            </Form.Item>
            <Form.Item label="字段" name="field_2">
                <Input.TextArea />
            </Form.Item>
            <Form.Item label="字段" name="field_3">
                <Select />
            </Form.Item>
            <Form.Item label="字段" name="field_4">
                <Switch />
            </Form.Item>
        </Form>
    );
});
