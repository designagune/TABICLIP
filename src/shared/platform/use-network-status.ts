'use client';

import {useEffect, useState} from 'react';

import type {PlatformService} from './platform-service';

export function useNetworkStatus(service: PlatformService) {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let active = true;
    void service.getNetworkStatus().then((status) => {
      if (active) setOnline(status.online);
    });
    const unsubscribe = service.subscribeNetworkStatus((status) =>
      setOnline(status.online)
    );
    return () => {
      active = false;
      unsubscribe();
    };
  }, [service]);

  return online;
}
