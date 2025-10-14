
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Truck, User, X, ZoomIn, ZoomOut, Redo, MapPin, Package, Clock, Milestone } from 'lucide-react';
import type { LiveDriver, LiveDelivery } from '@/lib/truckershub-types';
import Link from 'next/link';

type ApiResponse<T> = {
    status: boolean;
    response: T[] | {};
};

const MAP_IMAGE_URL = 'https://api.truckershub.in/v1/map';
const MAP_DIMENSIONS = { width: 8192, height: 8192 };
const MAP_BOUNDS = {
  minX: -40000,
  maxX: 40000,
  minY: -40000,
  maxY: 40000,
};

async function getLiveDrivers(): Promise<LiveDriver[]> {
    try {
        const res = await fetch(`/api/truckershub?endpoint=live/drivers`);
        if (!res.ok) {
            console.error("Failed to fetch live drivers:", res.status, await res.text());
            return [];
        }
        const data: ApiResponse<LiveDriver> = await res.json();
        if (data && data.status && Array.isArray(data.response)) {
            return data.response;
        }
        return [];
    } catch (error) {
        console.error("Error fetching live drivers:", error);
        return [];
    }
}

async function getLiveDeliveries(): Promise<LiveDelivery[]> {
    try {
        const res = await fetch(`/api/truckershub?endpoint=live/delivery`);
        if (!res.ok) {
            console.error("Failed to fetch live deliveries:", res.status, await res.text());
            return [];
        }
        const data: ApiResponse<LiveDelivery> = await res.json();
        if (data && data.status && Array.isArray(data.response)) {
            return data.response;
        }
        return [];
    } catch (error) {
        console.error("Error fetching live deliveries:", error);
        return [];
    }
}

const formatEta = (seconds: number) => {
    if (seconds <= 0) return 'Arrived';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [
        h > 0 ? `${h}h` : '',
        m > 0 ? `${m}m` : '',
        s > 0 ? `${s}s` : '',
    ].filter(Boolean).join(' ');
};

export function LiveMapClient() {
    const [drivers, setDrivers] = useState<LiveDriver[]>([]);
    const [deliveries, setDeliveries] = useState<LiveDelivery[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [scale, setScale] = useState(0.2);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [selectedDriver, setSelectedDriver] = useState<LiveDriver | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        const [driversData, deliveriesData] = await Promise.all([
            getLiveDrivers(),
            getLiveDeliveries()
        ]);
        setDrivers(driversData);
        setDeliveries(deliveriesData);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const convertCoords = (driverX: number, driverY: number) => {
        const mapWidth = MAP_DIMENSIONS.width;
        const mapHeight = MAP_DIMENSIONS.height;
        const rangeX = MAP_BOUNDS.maxX - MAP_BOUNDS.minX;
        const rangeY = MAP_BOUNDS.maxY - MAP_BOUNDS.minY;

        const x = ((driverX - MAP_BOUNDS.minX) / rangeX) * mapWidth;
        const y = ((driverY - MAP_BOUNDS.minY) / rangeY) * mapHeight;

        return { x, y };
    };
    
    const handleZoomIn = () => setScale(s => Math.min(s * 1.2, 5));
    const handleZoomOut = () => setScale(s => Math.max(s / 1.2, 0.1));
    const handleReset = () => {
        setScale(0.2);
        setPosition({ x: 0, y: 0 });
        setSelectedDriver(null);
    }
    
    const handleDriverClick = (driver: LiveDriver) => {
        setSelectedDriver(driver);
        const { x, y } = convertCoords(driver.map.x, driver.map.y);
        
        setScale(1); 
        setPosition({
            x: -(x * 1) + window.innerWidth / 2,
            y: -(y * 1) + window.innerHeight / 2,
        });
    };

    const selectedDriverDelivery = selectedDriver ? deliveries.find(d => d.driver_id === selectedDriver.id) : null;

    return (
        <div className="relative w-full h-full overflow-hidden bg-gray-800">
            <div className="absolute top-4 left-4 z-10 space-x-2">
                <Button onClick={handleZoomIn} size="icon"><ZoomIn /></Button>
                <Button onClick={handleZoomOut} size="icon"><ZoomOut /></Button>
                <Button onClick={handleReset} size="icon"><Redo /></Button>
            </div>

            {isLoading && (
                <div className="absolute top-4 right-4 z-10">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
            )}
             {!isLoading && (
                <div className="absolute top-4 right-4 z-10 text-white bg-black/50 px-3 py-1.5 rounded-md">
                   {drivers.length} Driver(s) Online
                </div>
            )}

            <div
                className="absolute"
                style={{
                    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                    transition: 'transform 0.5s ease',
                }}
            >
                <Image src={MAP_IMAGE_URL} alt="Live Map" width={MAP_DIMENSIONS.width} height={MAP_DIMENSIONS.height} unoptimized />
                
                {drivers.map(driver => {
                    const { x, y } = convertCoords(driver.map.x, driver.map.y);
                    const isSelected = selectedDriver?.id === driver.id;

                    return (
                        <div
                            key={driver.id}
                            className="absolute -translate-x-1/2 -translate-y-full cursor-pointer group"
                            style={{ left: x, top: y, transition: 'transform 0.5s' }}
                            onClick={() => handleDriverClick(driver)}
                        >
                            <div className="relative">
                                <Image src={driver.avatar} alt={driver.username} width={40} height={40} className={`rounded-full border-2 transition-all ${isSelected ? 'border-primary scale-125' : 'border-white group-hover:scale-110'}`} />
                                <div className="absolute bottom-0 right-0 -mb-1 -mr-1 bg-gray-800 rounded-full p-0.5">
                                    <Truck size={12} className="text-white"/>
                                </div>
                            </div>
                           
                            <div className={`absolute bottom-full mb-2 w-max max-w-xs transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <div className="bg-black/70 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap">
                                    {driver.username}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedDriver && (
                <Card className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-md bg-card/90 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                             <Image src={selectedDriver.avatar} alt={selectedDriver.username} width={48} height={48} className="rounded-full" />
                             <div>
                                <CardTitle>{selectedDriver.username}</CardTitle>
                                <p className="text-sm text-muted-foreground">{selectedDriver.role}</p>
                             </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedDriver(null)}><X /></Button>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                        <div className="text-sm space-y-2">
                             <p className="flex items-center gap-2"><MapPin size={16}/> {selectedDriver.location.on_road ? `On ${selectedDriver.location.road_name}` : `In ${selectedDriver.location.city}, ${selectedDriver.location.country}`}</p>
                             <p className="flex items-center gap-2"><Truck size={16}/> {selectedDriver.truck.make} {selectedDriver.truck.model}</p>
                             {selectedDriverDelivery ? (
                                <>
                                    <p className="flex items-center gap-2"><Package size={16}/> Hauling {selectedDriverDelivery.cargo.name} to {selectedDriverDelivery.destination_city}</p>
                                    <p className="flex items-center gap-2"><Milestone size={16}/> {selectedDriverDelivery.distance.remaining.toLocaleString()}km remaining</p>
                                    <p className="flex items-center gap-2"><Clock size={16}/> ETA: {formatEta(selectedDriverDelivery.eta)}</p>
                                </>
                             ) : (
                                 <p className="flex items-center gap-2"><Package size={16}/> Not on a delivery</p>
                             )}
                        </div>
                         <Button variant="outline" size="sm" asChild>
                            <Link href={`/driver-hub/members`}>View Profile</Link>
                         </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
