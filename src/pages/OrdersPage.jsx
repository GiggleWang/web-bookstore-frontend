import {useEffect, useState} from "react";
import {getOrders} from "../service/orders";
import {Card, Input, Button, DatePicker} from "antd";
import OrdersExhibition from "../components/OrdersExhibition";

const {RangePicker} = DatePicker;

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState([]);
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    const initOrders = async (filters = {}) => {
        let orders = await getOrders(filters);
        console.log("Orders before set state:", orders);  // 状态更新前打印
        setOrders(orders);
        console.log("Orders after set state:", orders);  // 状态更新后打印
    }

    useEffect(() => {
        initOrders();
    }, []);

    const handleSearch = () => {
        const filters = {};
        if (searchTerm) {
            filters.bookName = searchTerm;
        }
        if (dateRange.length === 2) {
            filters.startDate = dateRange[0].format('YYYY-MM-DD');
            filters.endDate = dateRange[1].format('YYYY-MM-DD');
        }
        initOrders(filters);
    };

    return (
        isAdmin ? (
            <>
                <h1>所有用户订单</h1>
                <div style={{marginBottom: '16px'}}>
                    <Input
                        placeholder="搜索书籍名称"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{width: '200px', marginRight: '8px'}}
                    />
                    <RangePicker
                        onChange={(dates) => setDateRange(dates)}
                        style={{marginRight: '8px'}}
                    />
                    <Button type="primary" onClick={handleSearch}>搜索</Button>
                </div>
                <Card className="card-container">
                    <OrdersExhibition orderList={orders}></OrdersExhibition>
                </Card>
            </>

        ) : (
            <>
                <div style={{marginBottom: '16px'}}>
                    <Input
                        placeholder="搜索书籍名称"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{width: '200px', marginRight: '8px'}}
                    />
                    <RangePicker
                        onChange={(dates) => setDateRange(dates)}
                        style={{marginRight: '8px'}}
                    />
                    <Button type="primary" onClick={handleSearch}>搜索</Button>
                </div>
                <Card className="card-container">
                    <OrdersExhibition orderList={orders}></OrdersExhibition>
                </Card>
            </>
        )
    )
}
