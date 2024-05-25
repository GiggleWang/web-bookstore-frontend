import {Avatar, List, Table} from "antd";
import {getTime} from "../service/orders";

function OrdersTable({orderList}) {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    let tableColumns;
    if (isAdmin) {
        tableColumns = [
            {title: '用户id', dataIndex: 'userId', key: 'userId'},
            {title: '收件人', dataIndex: 'receiver', key: 'receiver'},
            {title: '地址', dataIndex: 'shippingAddress', key: 'shippingAddress'},
            {
                title: '总金额', dataIndex: 'totalPrice', key: 'totalPrice',
                render: (value) => `¥${(value / 100).toFixed(2)}`
            },
            {
                title: '订单时间', dataIndex: 'orderDate', key: 'orderDate',
                render: (timestamp) => getTime(timestamp)
            }];
    }else {
        tableColumns = [
            {title: '收件人', dataIndex: 'receiver', key: 'receiver'},
            {title: '地址', dataIndex: 'shippingAddress', key: 'shippingAddress'},
            {
                title: '总金额', dataIndex: 'totalPrice', key: 'totalPrice',
                render: (value) => `¥${(value / 100).toFixed(2)}`
            },
            {
                title: '订单时间', dataIndex: 'orderDate', key: 'orderDate',
                render: (timestamp) => getTime(timestamp)
            }];
    }


    return (
        <Table
            columns={tableColumns}
            expandable={{
                expandedRowRender: (record) => (
                    <List
                        dataSource={record.items} // 修改这里使用 record.items
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar shape="square" size={80} src={item.book.cover}/>}
                                    title={item.book.name}
                                    description={`数量：${item.quantity}`}
                                />
                            </List.Item>
                        )}
                    />
                ),
            }}
            dataSource={orderList.map(order => ({
                ...order,
                key: order.id
            }))}
        />
    );
}

export default OrdersTable;
