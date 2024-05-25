import {useEffect, useState} from "react";
import {getOrders} from "../service/orders";
import {Card} from "antd";
import OrdersExhibition from "../components/OrdersExhibition";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const initOrders = async () => {
        let orders = await getOrders();
        console.log("Orders before set state:", orders);  // 状态更新前打印
        setOrders(orders);
        console.log("Orders after set state:", orders);  // 状态更新后打印
    }


    useEffect(() => {
        initOrders();
    }, []);

    return (
        isAdmin?(
            <>
                <h1>所有用户订单</h1>
                <Card className="card-container">
                    <OrdersExhibition orderList={orders}></OrdersExhibition>
                </Card>
            </>
            ):
        <Card className="card-container">
            <OrdersExhibition orderList={orders}></OrdersExhibition>
        </Card>
    )


}