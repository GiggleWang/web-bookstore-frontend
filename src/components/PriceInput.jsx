import React, { useState, useEffect } from 'react';
import { Input, Row, Col } from 'antd';

const PriceInput = ({ value = {}, onChange }) => {
    const [yuan, setYuan] = useState(value.yuan || 0);
    const [fen, setFen] = useState(value.fen || 0);

    useEffect(() => {
        setYuan(value.yuan || 0);
        setFen(value.fen || 0);
    }, [value]);

    const triggerChange = (changedValue) => {
        if (onChange) {
            onChange({
                yuan,
                fen,
                ...value,
                ...changedValue,
            });
        }
    };

    const onYuanChange = (e) => {
        const newYuan = parseInt(e.target.value || 0, 10);
        if (Number.isNaN(newYuan)) {
            return;
        }
        setYuan(newYuan);
        triggerChange({ yuan: newYuan });
    };

    const onFenChange = (e) => {
        const newFen = parseInt(e.target.value || 0, 10);
        if (Number.isNaN(newFen)) {
            return;
        }
        setFen(newFen);
        triggerChange({ fen: newFen });
    };

    return (
        <Row gutter={8}>
            <Col span={12}>
                <Input
                    type="number"
                    value={yuan}
                    onChange={onYuanChange}
                    placeholder="元"
                />
            </Col>
            <Col span={12}>
                <Input
                    type="number"
                    value={fen}
                    onChange={onFenChange}
                    placeholder="分"
                    max={99}
                />
            </Col>
        </Row>
    );
};

export default PriceInput;
