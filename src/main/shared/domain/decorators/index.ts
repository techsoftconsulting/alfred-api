import { Inject, Injectable } from '@nestjs/common';
/* 
export function service(key: any) {
  return Inject(key);
}
 */
export function injectable() {
  return Injectable();
}

export function inject(key: any) {
  return Inject(key);
}

export function config() {
  return null;
}
