"use client";

import QRCode from "qrcode";
import { useEffect, useRef } from "react";
import { getTableLink } from "../lib/utils";

export default function QrcodeTable({
	token,
	tableNumber,
	width,
}: {
	token: string;
	tableNumber: number;
	width?: number;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		QRCode.toCanvas(
			canvas,
			getTableLink({
				token,
				tableNumber,
			}),
			function (error) {
				if (error) console.error(error);
				console.log("success!");
			}
		);
	}, [tableNumber, token]);

	return <canvas ref={canvasRef}></canvas>;
}
