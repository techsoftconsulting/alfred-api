import { Injectable, Scope } from '@nestjs/common';

export default function service(scope?: any) {
  return Injectable({ scope: scope ?? Scope.DEFAULT });
}
