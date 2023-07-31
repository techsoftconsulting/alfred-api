import { ArrayUtils, DateTimeUtils } from '@shared/domain/utils';
import RestaurantAreaInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-area-infrastructure-command-repository';
import { getRepository, Repository } from 'typeorm';
import { ReservationEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/reservation-entity';

export default class RestaurantReservationUtils {
  private areaRepo: RestaurantAreaInfrastructureCommandRepository;
  private readonly typeormReservationsRepo: Repository<ReservationEntity>;

  constructor() {
    this.typeormReservationsRepo = getRepository(ReservationEntity);
    this.areaRepo = new RestaurantAreaInfrastructureCommandRepository();
  }

  async findBusyTableRangeSlots(restaurantId: string, date: string) {
    const restaurantTables = await this.findRestaurantTables(restaurantId);
    const repository = this.typeormReservationsRepo;

    const dayReservations = await repository.find({
      where: {
        date: date,
        restaurantId: restaurantId,
        status: 'ACTIVE',
        cancelled: false,
      },
    });

    const busyTables = dayReservations.map((r) => {
      const tableDuration = restaurantTables.find(
        (t) => t.id === r.table.id,
      ).reservationDuration;

      const start = DateTimeUtils.fromTime(r.hour);
      const endHour = DateTimeUtils.addMinutes(
        DateTimeUtils.addHours(start, tableDuration.hours),
        tableDuration.minutes,
      );

      return {
        tableId: r.table.id,
        hour: start,
        endHour: endHour,
        date: date,
        formattedHour: DateTimeUtils.format(start, 'HH:mm'),
      };
    });

    return busyTables;
  }

  findRestaurantTables(restaurantId: string) {
    return this.areaRepo.findTables(restaurantId);
  }

  async findFreeTables(restaurantId: string, date: string, hour: string) {
    const busyTables = await this.findBusyTableRangeSlots(restaurantId, date);
    const restaurantTables = await this.areaRepo.findTables(restaurantId);

    const finalHour = DateTimeUtils.fromTime(hour);

    const discardedTables = ArrayUtils.uniq(
      busyTables
        .filter((t) => {
          return DateTimeUtils.isBetween(
            finalHour,
            {
              start: t.hour,
              end: t.endHour,
            },
            '[)',
          );
        })
        .map((t) => t.tableId),
    );

    return restaurantTables.filter((t) => !discardedTables.includes(t.id));
  }

  getDayAvailableHourRanges(
    availableTables: any,
    dateName: string,
    merged = true,
  ) {
    const tables = availableTables.flatMap((t) => {
      const daySchedule = t.schedule[dateName];

      return {
        start: DateTimeUtils.format(daySchedule.startHour, 'HH:mm'),
        startHour: new Date(daySchedule.startHour),
        endHour: new Date(daySchedule.endHour),
        duration: t.reservationDuration,
        tableId: t.id,
        areaName: t.areaName,
        capacity: t.capacity,
        tableName: `Mesa ${t.number}`,
      };
    });

    return ArrayUtils.orderBy(
      merged ? ArrayUtils.uniqBy(tables, 'start') : tables,
      ['startHour'],
      ['asc'],
    );
  }

  getRangeSlots(
    isToday: boolean,
    range: { startHour: any; endHour: any; duration: any },
  ) {
    return this.getNextHours(
      range.startHour,
      range.endHour,
      range.duration,
    ).filter((el) => {
      return isToday
        ? !DateTimeUtils.isPast(
            DateTimeUtils.fromTime(DateTimeUtils.format(el.start, 'HH:mm')),
          )
        : true;
    });
  }

  getNextHours(startHour, endHour, duration) {
    const finalReservDuration = duration.hours + duration.minutes / 60;

    const range =
      Math.floor(
        Math.floor(DateTimeUtils.differenceInHours(endHour, startHour)) /
          finalReservDuration,
      ) - 1;

    let currItem = {
      start: startHour,
      end: DateTimeUtils.addMinutes(
        DateTimeUtils.addHours(
          DateTimeUtils.fromTime(startHour),
          duration.hours,
        ),
        duration.minutes,
      ),
    };

    const finalItems = [currItem];

    for (let i = 0; i < range; i++) {
      const nextItem = DateTimeUtils.addMinutes(
        DateTimeUtils.addHours(
          DateTimeUtils.fromTime(currItem.end),
          duration.hours,
        ),
        duration.minutes,
      );

      const final = {
        start: currItem.end,
        end: nextItem,
      };
      finalItems.push(final);

      currItem = final;
    }

    return finalItems;
  }

  /*
                                          async getDayAvailability(id, date) {
                                            const tables = await this.findRestaurantTables(id);
                                            const dateName = DateTimeUtils.format(date, 'dddd').toUpperCase();
                                            const dayAvailableTables = tables.filter(
                                              (t) => !!t.schedule[dateName]?.active,
                                            );
                                        
                                            const isToday =
                                              DateTimeUtils.format(date, 'YYYY-MM-DD') ==
                                              DateTimeUtils.format(new Date(), 'YYYY-MM-DD');
                                        
                                            const dayBusyTablesSlots = await this.findBusyTableRangeSlots(
                                              id,
                                              DateTimeUtils.format(date, 'YYYY-MM-DD'),
                                            );
                                        
                                            const dayAvailableHourRanges = this.getDayAvailableHourRanges(
                                              dayAvailableTables,
                                              dateName,
                                            );
                                        
                                            const finalSlots = dayAvailableHourRanges.reduce((acc, current) => {
                                              const rangeSlots = this.getRangeSlots(isToday, current)
                                                .map((z) => {
                                                  return DateTimeUtils.format(z, 'HH:mm');
                                                })
                                                .filter((s) => {
                                                  /!*All tables are taken for that hour *!/
                                                  const isFull =
                                                    dayBusyTablesSlots.filter((bs) => bs.formattedHour === s).length ===
                                                    dayAvailableTables.length;
                                        
                                                  return !isFull;
                                                });
                                        
                                              return [...acc, ...rangeSlots];
                                            }, []);
                                        
                                            return finalSlots;
                                          }*/

  async getDayAvailability2(id, date) {
    const tables = await this.findRestaurantTables(id);
    const dateName = DateTimeUtils.format(date, 'dddd').toUpperCase();

    const dayAvailableTables = tables.filter(
      (t) => !!t.schedule[dateName]?.active,
    );

    const dayBusyTablesSlots = await this.findBusyTableRangeSlots(
      id,
      DateTimeUtils.format(date, 'YYYY-MM-DD'),
    );

    const isToday =
      DateTimeUtils.format(date, 'YYYY-MM-DD') ==
      DateTimeUtils.format(new Date(), 'YYYY-MM-DD');

    const dayAvailableHourRanges = this.getDayAvailableHourRanges(
      dayAvailableTables,
      dateName,
      false,
    );
    const finalSlots = dayAvailableHourRanges.reduce((acc, current) => {
      const rangeSlots = this.getRangeSlots(isToday, current)
        .map((z) => {
          return {
            start: DateTimeUtils.format(z.start, 'HH:mm'),
            end: DateTimeUtils.format(z.end, 'HH:mm'),
          };
        })
        .filter((s) => {
          const isFull = dayBusyTablesSlots.find((bs) => {
            return (
              bs.tableId === current.tableId &&
              DateTimeUtils.fromTime(bs.formattedHour) >=
                DateTimeUtils.fromTime(s.start) &&
              DateTimeUtils.fromTime(bs.formattedHour) <=
                DateTimeUtils.fromTime(s.end)
            );
          });

          return !isFull;
        });

      return {
        ...acc,
        [current.tableId]: {
          id: current.tableId,
          name: current.tableName,
          areaName: current.areaName,
          capacity: current.capacity,
          availableSlots: rangeSlots,
        },
      };
    }, {});

    return Object.values(finalSlots);
  }
}
