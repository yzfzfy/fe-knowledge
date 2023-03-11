import React, { useRef, useState, useEffect, useReducer } from "react";
import "./App.css";
import {
  Button,
  // Icon,
  message,
  Switch,
  Popconfirm,
  Modal,
  Space,
  Table,
  Typography,
} from "antd";
import EditModalContent from "./editModalContent";
import type { IEditState, TUseSet } from "./types";

const useSet: TUseSet = (initValues) =>
  useReducer((state, action) => ({ ...state, ...action }), initValues);

function App() {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [{ mode, modalVisible, initData }, setEditState] = useSet<IEditState>({
    mode: "new",
    modalVisible: false,
    initData: null,
  });

  const editModalContentRef = useRef<any>(null);
  const editingColumnRef = useRef<Record<string, any>>({});
  const getDataSourceFnRef = useRef<(any) => void>(() => {});

  const columns = [
    {
      title: "列名称",
      dataIndex: "column_1",
      ellipsis: true,
      align: "center" as "center",
    },
    {
      title: "列名称",
      dataIndex: "column_2",
      // align: "center",
    },
    {
      title: "boolean类型列",
      dataIndex: "status",
      // align: "center",
      render: (text, record) => {
        return (
          <Switch
            checked={!!text}
            onChange={(value) => {
              onEditSomeColumnEnd({ ...record, status: value });
            }}
          />
        );
      },
    },
    {
      title: "可原处输入框修改的列",
      dataIndex: "column_3",
      // align: "center",
      render(text, record) {
        return (
          <Typography.Paragraph
            style={{ marginBottom: 0 }}
            editable={{
              tooltip: "修改",
              onStart: () => {
                editingColumnRef.current = record;
              },
              onChange: (value) => {
                editingColumnRef.current.column_3 = value;
              },
              onEnd: () => {
                // editingColumnRef.current
                onEditSomeColumnEnd({
                  ...record,
                  ...editingColumnRef.current,
                });
              },
            }}
          >
            {text}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      // align: "center",
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditState({
                mode: "edit",
                modalVisible: true,
                initData: record,
              });
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => {
              onDelete(record);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getDataSourceFnRef.current({});
  }, []);

  // 获取数据源
  getDataSourceFnRef.current = function getDataSource(params) {
    // setLoading(true);

    // api.getSomeData(params).then(() => {
    //     // 获取数据
    //     setDataSource([
    //         {
    //             column_1: "1",
    //             column_2: "1",
    //             column_3: "1",
    //             column_4: "1",
    //             column_5: "1",
    //         },
    //     ]);
    //     setLoading(false);
    // });
    setLoading(true);
    // 获取数据
    setDataSource([
      {
        column_1: "1",
        column_2: "1",
        column_3: "1",
        column_4: "1",
        column_5: "1",
      },
    ]);
    setLoading(false);
  };

  // 编辑行信息
  function onEditSomeColumnEnd(recordInfoAfterEdit) {
    // api.update(recordInfoAfterEdit).then(() => {
    //   getDataSource()
    // })
  }

  // 删除行
  function onDelete(record) {
    // api.delete({ id: record.id }).then(() => {
    //     getDataSource();
    // });
  }

  async function onOk() {
    // 获取值
    // const values = await editModalContentRef.current?.getValues();

    if (mode === "view") {
      setEditState({ modalVisible: false });

      return;
    }
    message.success("成功");

    // api["add/update"](values).then(() => {
    //     message.success("成功");
    //     setEditState({ modalVisible: false });
    // });
  }

  return (
    <div className="App">
      <Button
        onClick={() => {
          setEditState({ modalVisible: true, mode: "new" });
        }}
      >
        新建
      </Button>
      {/* Table更换为更高级的ProTable,功能更强大。主要依赖列定义的强大 */}
      <Table
        columns={columns}
        bordered
        size="small"
        dataSource={dataSource}
        loading={loading}
      />
      <Modal
        title={mode === "new" ? "新建" : mode === "edit" ? "编辑" : "查看"}
        visible={modalVisible}
        width={1000}
        onOk={onOk}
        onCancel={() => {
          setEditState({ modalVisible: false });
        }}
        okText="保存"
        cancelText="取消"
        maskClosable={false}
        destroyOnClose
      >
        <EditModalContent
          ref={editModalContentRef}
          {...initData}
          mode={mode}
        />
      </Modal>
    </div>
  );
}

export default App;
