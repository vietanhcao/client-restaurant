"use client";

import QRCode from "qrcode";
import { useEffect, useRef } from "react";
import { getTableLink } from "../lib/utils";

export default function QrcodeTable({
	token,
	tableNumber,
	width = 250,
}: {
	token: string;
	tableNumber: number;
	width?: number;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		canvas.height = width + 70;
		canvas.width = width;
		const canvasContext = canvas.getContext("2d")!;
		canvasContext.fillStyle = "#fff";
		canvasContext.fillRect(0, 0, canvas.width, canvas.height);
		canvasContext.font = "20px Arial";
		canvasContext.textAlign = "center";
		canvasContext.fillStyle = "#000";
		canvasContext.fillText(`Bàn số ${tableNumber}`, width / 2, width + 30);
		canvasContext.fillText(`Quét mã QR để gọi món`, width / 2, width + 50);

		const virtualCanvas = document.createElement("canvas");

		QRCode.toCanvas(
			virtualCanvas,
			getTableLink({
				token,
				tableNumber,
			}),
			function (error) {
				if (error) console.error(error);
				canvasContext.drawImage(virtualCanvas, 0, 0, width, width);
			}
		);
	}, [tableNumber, token, width]);

	return <canvas ref={canvasRef}></canvas>;
}
