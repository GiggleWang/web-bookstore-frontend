import {useEffect, useState} from "react";
import {getOrders} from "../service/orders";
import {Card} from "antd";
import OrdersExhibition from "../components/OrdersExhibition";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

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
        <Card className="card-container">
            <OrdersExhibition orderList={orders}></OrdersExhibition>
        </Card>
    )


}