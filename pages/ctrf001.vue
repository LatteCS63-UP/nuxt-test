<template>
  <SharedUiParentCard>
    <SharedBreadcrumbs
      title="Setup Holiday"
      :items="[
        {
          title: 'User Management',
          disabled: false,
          href: '',
        },
        {
          title: 'Setup Holiday',
          disabled: true,
          href: '',
        },
      ]"
    />
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="12" sm="4" class="pb-0"
              ><v-number-input
                density="compact"
                v-model="search.year"
                label="Year"
                variant="outlined"
                color="primary"
                :min="0"
              ></v-number-input
            ></v-col>
            <v-col cols="12" sm="4" class="pb-0"
              ><v-text-field
                density="compact"
                v-model="search.market"
                label="Market"
                variant="outlined"
                color="primary"
              ></v-text-field
            ></v-col>
            <v-col cols="12" sm="4" class="pb-0"
              ><v-btn
                variant="tonal"
                class="text-none !font-semibold"
                height="40px"
                color="primary"
                @click="searchClick"
                block
                >Search</v-btn
              ></v-col
            >
          </v-row>
        </v-col>
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="12" sm="6" class="pb-0">
              <v-btn
                variant="outlined"
                class="text-none"
                height="40px"
                block
                @click="handleImportExcel"
                :disabled="holidayDate.length > 0 || item.holidayType === null"
                >Import file</v-btn
              >
            </v-col>
            <v-col cols="12" sm="6" class="pb-0">
              <v-btn
                variant="outlined"
                class="text-none"
                height="40px"
                block
                @click="onExport"
                :disabled="holidayDate.length === 0"
                >Export file</v-btn
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-radio-group v-model="search.holidayType" inline>
            <v-radio label="Local" value="local" color="primary"></v-radio>
            <v-radio label="Global" value="global" color="primary"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="item.holidayType">
        <v-col cols="12" xl="6">
          <div class="flex justify-center">
            <DatePicker
              v-model.range="date"
              :rows="4"
              :columns="3"
              :initial-page="{ month: 1, year: item.year }"
              :min-page="{ month: 1, year: item.year }"
              :max-page="{ month: 12, year: item.year }"
              :min-date="new Date()"
              :key="item.year"
              :attributes="rangeAttributes"
              :disabled-dates="disabledDates"
              @dayclick="handleDayClick"
              :is-range="false"
            />
          </div>
        </v-col>
        <v-col cols="12" xl="6">
          <div class="flex justify-center">
            <div class="flex flex-col gap-y-2 w-[752px]">
              <v-table
                fixed-header
                class="max-h-[318px]"
                :class="holidayDate.length > 0 ? '!rounded-md' : ''"
              >
                <thead>
                  <tr>
                    <th
                      class="text-center font-weight-bold bg-primary !h-[35px]"
                    >
                      Date<span class="font-medium"> (YYYY/MM/DD)</span>
                    </th>
                    <th
                      class="font-weight-bold bg-primary text-center !h-[35px]"
                    >
                      Can trade
                    </th>
                    <th class="text-left font-weight-bold bg-primary !h-[35px]">
                      Description
                    </th>
                    <th
                      v-if="!status.confirm"
                      class="text-center font-weight-bold bg-primary !h-[35px]"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody v-if="holidayDate.length > 0">
                  <tr v-for="item in holidayDate" :key="formatDate(item.date)">
                    <td
                      class="border-b-md border-primary text-center"
                      :class="status.confirm ? 'bg-[#FAFAFA]' : ''"
                    >
                      {{ formatDate(item.date) }}
                    </td>
                    <td
                      class="border-b-md border-primary text-center"
                      :class="status.confirm ? 'bg-[#FAFAFA]' : ''"
                    >
                      <span v-if="status.confirm || item.type === 'query'">{{
                        item.canTrade
                      }}</span>
                      <v-select
                        v-else
                        v-model="item.canTrade"
                        :items="['Y', 'N', 'X']"
                        density="compact"
                        variant="underlined"
                        hide-details
                      />
                    </td>
                    <td
                      class="border-b-md border-primary"
                      :class="status.confirm ? 'bg-[#FAFAFA]' : ''"
                    >
                      <span v-if="status.confirm || item.type === 'query'">{{
                        item.description
                      }}</span>
                      <v-text-field
                        v-else
                        v-model="item.description"
                        style="border: 0px solid"
                        density="compact"
                        variant="underlined"
                        :rules="[(v) => !!v || 'This field is required']"
                        hide-details
                      />
                    </td>
                    <td
                      v-if="!status.confirm"
                      class="border-b-md border-primary text-center bg-[#FAFAFA]"
                    >
                      <v-btn
                        v-if="item.type === 'query'"
                        color="warning"
                        variant="outlined"
                        class="text-none"
                        @click="item.type = ''"
                        >Edit</v-btn
                      >
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <div
                v-if="holidayDate.length > 0"
                class="flex justify-end py-2 gap-x-2"
              >
                <v-btn
                  color="muted"
                  variant="outlined"
                  class="text-none"
                  @click="status.dialogCopy = true"
                  >Copy</v-btn
                >
                <v-btn
                  v-if="!status.confirm"
                  color="success"
                  variant="outlined"
                  class="text-none"
                  @click="status.confirm = true"
                  >Confirm</v-btn
                >
                <v-btn
                  v-else
                  color="warning"
                  variant="outlined"
                  class="text-none"
                  @click="status.confirm = false"
                  >Edit</v-btn
                >
                <v-btn
                  v-if="!status.confirm"
                  color="error"
                  variant="outlined"
                  class="text-none"
                  @click="
                    status.warning = true;
                    status.warningTitle = 'Are you sure?';
                    status.warningMessage = 'Please confirm before clearing.';
                  "
                  >Clear all</v-btn
                >
              </div>
              <div>
                <p class="text-error font-semibold flex justify-start gap-x-2">
                  <span>N = No Trade and Settlement</span>
                  <span>Y = Can Trade and Can Settlement</span>
                  <span>X = Half Day</span>
                </p>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-dialog v-model="status.dialogCopy" max-width="600" persistent>
        <v-card v-if="!status.loading">
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="4" class="pb-0">
                <v-number-input
                  density="compact"
                  v-model="copy.year"
                  label="Year"
                  variant="outlined"
                  color="primary"
                  :min="0"
                ></v-number-input>
              </v-col>
              <v-col cols="12" sm="4" class="pb-0">
                <v-text-field
                  density="compact"
                  v-model="copy.market"
                  label="Market"
                  variant="outlined"
                  color="primary"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pt-0">
                <v-radio-group v-model="copy.holidayType" inline>
                  <v-radio
                    label="Local"
                    value="local"
                    color="primary"
                  ></v-radio>
                  <v-radio
                    label="Global"
                    value="global"
                    color="primary"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              variant="tonal"
              class="text-none"
              color="primary"
              @click="copyInsertHoliday"
              >Confirm</v-btn
            >
            <v-btn
              variant="tonal"
              class="text-none"
              color="error"
              @click="cancelCopy"
              >Cancel</v-btn
            >
          </v-card-actions>
        </v-card>
        <v-progress-circular
          v-else
          class="mx-auto my-4"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-dialog>

      <v-dialog v-model="status.warning" max-width="600" persistent>
        <v-card :title="status.warningTitle" :text="status.warningMessage">
          <template v-slot:actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="status.warningTitle === 'Are you sure?'"
              class="ms-auto"
              variant="tonal"
              color="primary"
              @click="
                selectedRanges = [];
                status.warning = false;
              "
              >Yes</v-btn
            >
            <v-btn
              v-if="status.warningTitle === 'Are you sure?'"
              class="ms-auto"
              variant="tonal"
              color="error"
              @click="status.warning = false"
              >No</v-btn
            >
            <v-btn
              v-else
              class="ms-auto"
              variant="tonal"
              color="primary"
              @click="status.warning = false"
              >OK</v-btn
            >
          </template></v-card
        >
      </v-dialog>
    </v-container>
  </SharedUiParentCard>
</template>

<script lang="ts">
interface holidayRanges {
  dot?: string;
  query?: boolean;
  dates: {
    start: Date;
    end: Date;
  };
}
interface HolidayDes {
  type?: string;
  date: Date;
  canTrade: string;
  description: string | null;
}
import holiday from "~/data/json/holidayQuery.json";
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";
import * as XLSX from "xlsx";
export default {
  components: {
    DatePicker,
  },
  computed: {
    rangeAttributes() {
      // return this.selectedRanges.map((range, i) => ({
      //   key: `range-${i}`,
      //   // highlight: 'green',
      //   dot: 'green',
      //   dates: {
      //     start: range.start ? new Date(range.start) : undefined,
      //     end: range.end ? new Date(range.end) : undefined,
      //   },
      // if(i < 1) {
      //   return {
      //     key: `range-${i}`,
      //     highlight: 'green',
      //     dates: {
      //       start: range.start ? new Date(range.start) : undefined,
      //       end: range.end ? new Date(range.end) : undefined,
      //     },
      //   }
      // }else {}
      // }));
      // return [
      //   { dot: 'gray', dates: { end: new Date() } },
      //   { content: 'blue', dates: { start: new Date() } },
      // ];
      return this.selectedRanges.map((range) => ({
        dot: range.dot,
        dates: {
          start: range.dates.start,
          end: range.dates.end,
        },
      }));
      // return {
      //   dot: item.dot,
      //   dates: {
      //     start: item.dates.start,
      //     end: item.dates.end,
      //   },
      // };
      // return this.selectedRanges;
    },
  },
  data() {
    const now = new Date();
    const year = now.getFullYear();

    return {
      dateNow: now,
      date: null as any | null,
      selectedRanges: [] as holidayRanges[],
      holidayDate: [] as HolidayDes[],
      tempRange: { start: null, end: null } as {
        start: Date | null;
        end: Date | null;
      },
      disabledDates: [
        {
          repeat: {
            weekdays: [1, 7],
          },
        },
      ],
      item: {
        year: year,
        market: "NASDAQ",
        holidayType: null as string | null,
      },

      copy: {
        year: year + 1,
        market: null as string | null,
        holidayType: null as string | null,
      },

      search: {
        year: year,
        market: "NASDAQ",
        holidayType: "global",
      },

      status: {
        confirm: false,
        dialogCopy: false,
        loading: false,

        warning: false,
        warningTitle: "",
        warningMessage: "",
      },
    };
  },
  methods: {
    fetchHoliday() {
      this.selectedRanges = holiday.lists.map((item) => ({
        query: true,
        dot: "green",
        dates: {
          start: new Date(item.holidaydate),
          end: new Date(item.holidaydate),
        },
      }));

      this.holidayDate = holiday.lists.map((item) => ({
        type: "query",
        date: new Date(item.holidaydate),
        canTrade: item.cantrade || "N",
        description: item.description || null,
      }));

      // this.allSelectedDates();
    },
    // async allSelectedDates() {
    //   if (this.holidayDate.length !== 0) {
    //     // this.holidayDate.forEach((day) => {
    //     //   if (
    //     //     !this.isRangeOverlapping(day.date, day.date, this.selectedRanges)
    //     //   ) {
    //     //     this.holidayDate = this.holidayDate.filter(
    //     //       (item) => item.date !== day.date,
    //     //     );
    //     //   }
    //     // });
    //     // this.selectedRanges.forEach((range) => {
    //     //   if (!range.query) {
    //     //     const current = range.dates.start;
    //     //     const end = range.dates.end;

    //     //     if (current && end) {
    //     //       while (current <= end) {
    //     //         const date_same = this.holidayDate.some((day) => {
    //     //           const date_main = current.toISOString().slice(0, 10);
    //     //           const date_check = day.date.toISOString().slice(0, 10);
    //     //           return date_main === date_check;
    //     //         });
    //     //         if (!date_same) {
    //     //           this.holidayDate.push({
    //     //             date: new Date(current),
    //     //             canTrade: "N",
    //     //             description: null,
    //     //           });
    //     //         }
    //     //         current.setDate(current.getDate() + 1);
    //     //       }
    //     //     }
    //     //   }
    //     // });
    //     //   // this.holidayDate.sort((day1, day2) => {
    //     //   //   const monthDiff = day1.date.getMonth() - day2.date.getMonth();
    //     //   //   if (monthDiff !== 0) return monthDiff;
    //     //   //   return day1.date.getDate() - day2.date.getDate();
    //     //   // });
    //     //   // for (const range of this.selectedRanges) {
    //     //   //   let current = range.dates.start;
    //     //   //   const end = range.dates.end;
    //     //   //   if (current && end) {
    //     //   //     while (current <= end) {
    //     //   //       const date_main = current.toISOString().slice(0, 10);
    //     //   //       const date_same = this.holidayDate.some((day) => {
    //     //   //         const date_check = day.date.toISOString().slice(0, 10);
    //     //   //         return date_main === date_check;
    //     //   //       });
    //     //   //       if (!date_same) {
    //     //   //         this.holidayDate.push({
    //     //   //           date: current,
    //     //   //           canTrade: "N",
    //     //   //           description: null,
    //     //   //         });
    //     //   //       }
    //     //   //       current.setDate(current.getDate() + 1);
    //     //   //       await Promise.resolve(); // ให้ async ทำงานทีละรอบ
    //     //   //     }
    //     //   //   }
    //     //   // }
    //   } else {
    //     //   // await this.selectedRanges.forEach((range) => {
    //     //   //   const current = range.dates.start;
    //     //   //   const end = range.dates.end;
    //     //   //   if (current && end) {
    //     //   //     while (current <= end) {
    //     //   //       this.holidayDate.push({
    //     //   //         date: new Date(current),
    //     //   //         canTrade: 'N',
    //     //   //         description: null,
    //     //   //       });
    //     //   //       current.setDate(current.getDate() + 1);
    //     //   //     }
    //     //   //   }
    //     //   // });
    //     for (const range of this.selectedRanges) {
    //       let current = range.dates.start;
    //       const end = range.dates.end;
    //       if (current && end) {
    //         while (current <= end) {
    //           this.holidayDate.push({
    //             date: current,
    //             canTrade: "N",
    //             description: null,
    //           });
    //           current.setDate(current.getDate() + 1);
    //           await Promise.resolve();
    //         }
    //       }
    //     }
    //     // }
    //     // let current = dates.start;
    //     // let end = dates.end;
    //     // while (current <= end) {
    //     //   // this.holidayDate.push({
    //     //   //   date: new Date(current),
    //     //   //   canTrade: "N",
    //     //   //   description: null,
    //     //   // });
    //     //   current.setDate(current.getDate() + 1);
    //   }
    //   console.log(this.selectedRanges.length);
    // },

    allSelectedDates() {
      if (this.holidayDate.length !== 0) {
        this.holidayDate.forEach((day) => {
          if (
            !this.isRangeOverlapping(day.date, day.date, this.selectedRanges)
          ) {
            this.holidayDate = this.holidayDate.filter(
              (item) => item.date !== day.date
            );
          }
        });

        this.selectedRanges.forEach((range) => {
          const current = new Date(range.dates.start);
          const end = new Date(range.dates.end);

          while (current <= end) {
            const date_same = this.holidayDate.some((day) => {
              const date_main = current.toISOString().slice(0, 10);
              const date_check = day.date.toISOString().slice(0, 10);
              return date_main === date_check;
            });
            if (!date_same) {
              this.holidayDate.push({
                date: new Date(current),
                canTrade: "N",
                description: null,
              });
            }
            current.setDate(current.getDate() + 1);
          }
        });

        this.holidayDate.sort((day1, day2) => {
          const monthDiff = day1.date.getMonth() - day2.date.getMonth();
          if (monthDiff !== 0) return monthDiff;

          return day1.date.getDate() - day2.date.getDate();
        });
      } else {
        this.selectedRanges.forEach((range) => {
          const current = new Date(range.dates.start);
          const end = new Date(range.dates.end);

          while (current <= end) {
            this.holidayDate.push({
              date: new Date(current),
              canTrade: "N",
              description: null,
            });
            current.setDate(current.getDate() + 1);
          }
        });
      }
    },

    handleDayClick(day: any) {
      if (!this.status.confirm) {
        if (this.date) {
          if (
            !this.isRangeOverlapping(
              this.date.start,
              this.date.end,
              this.selectedRanges
            )
          ) {
            const diffDays =
              (this.date.start.getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24);
            if (diffDays >= 3) {
              // this.selectedRanges.push({
              //   start: this.date.start,
              //   end: this.date.end,
              // });
              this.selectedRanges.push({
                dot: "blue",
                dates: {
                  start: this.date.start,
                  end: this.date.end,
                },
              });
            }
          } else {
            this.selectedRanges = this.removeOverlappingRanges(
              this.date.start,
              this.date.end,
              this.selectedRanges
            );
          }
          this.date = null;
          this.tempRange = { start: null, end: null };
        } else {
          const diffDays =
            (day.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays >= 3) {
            if (day.weekday !== 1 || day.weekday !== 7) {
              if (this.tempRange.start && !this.tempRange.end) {
                const start = this.tempRange.start;
                const end: Date = day.date;
                if (start === end) {
                  if (
                    this.isRangeOverlapping(start, end, this.selectedRanges)
                  ) {
                    this.selectedRanges = this.removeOverlappingRanges(
                      start,
                      end,
                      this.selectedRanges
                    );
                  }
                }
                this.tempRange = { start: null, end: null };
              } else {
                this.tempRange = { start: day.date, end: null };
              }
            }
          }
        }
      }
    },

    isRangeOverlapping(start: Date, end: Date, ranges: holidayRanges[]) {
      const normalize = (d: Date) =>
        new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const normStart = normalize(start);
      const normEnd = normalize(end);

      return ranges.some((range) => {
        const rangeStart = normalize(range.dates.start);
        const rangeEnd = normalize(range.dates.end);
        return !(normEnd < rangeStart || normStart > rangeEnd);
      });
    },

    removeOverlappingRanges(start: Date, end: Date, ranges: holidayRanges[]) {
      return ranges.filter((range) => {
        const holiday = [
          { dates: { start: range.dates.start, end: range.dates.end } },
        ];
        return !this.isRangeOverlapping(start, end, holiday);
      });
    },

    formatDate(date: Date, year?: number): string {
      const d = date.getDate().toString().padStart(2, "0");
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      const y = year || date.getFullYear();
      return `${y}-${m}-${d}`;
    },

    async searchClick() {
      this.item = await {
        ...this.search,
      };

      this.copy = await {
        ...this.item,
        year: this.item.year + 1,
      };

      this.fetchHoliday();

      // try {
      //   const response = await $fetch<any>("/api/holiday/query", {
      //     method: "POST",
      //     headers: {
      //       sessionid: useSessionStore().$state.sessionid!,
      //     },
      //     body: {
      //       year: this.item.year,
      //     },
      //   });

      //   const uniqueData = await response.list.filter((item, index, self) => {
      //     const dateStr = new Date(item.holidaydate).toISOString().slice(0, 10);
      //     return (
      //       self.findIndex(
      //         (i) =>
      //           new Date(i.holidaydate).toISOString().slice(0, 10) === dateStr
      //       ) === index
      //     );
      //   });

      //   const sortedData = await uniqueData.sort(
      //     (item1, item2) =>
      //       new Date(item1.holidaydate).getTime() -
      //       new Date(item2.holidaydate).getTime()
      //   );

      //   // let main_day = null as Date | null;
      //   // let start = null as Date | null;
      //   await sortedData.forEach((item: any) => {
      //     // this.selectedRanges.push({ start: item, end: item });
      //     this.selectedRanges.push({
      //       dot: "green",
      //       dates: {
      //         start: new Date(item.holidaydate),
      //         end: new Date(item.holidaydate),
      //       },
      //     });
      //     // const date = new Date(item.holidaydate);

      //     // const diffDays_3 =
      //     //   (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
      //     // if (diffDays_3 >= 3) {
      //     //   if (index === sortedData.length - 1) {
      //     //     if (main_day) {
      //     //       if (start) {
      //     //         const diffDays =
      //     //           (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

      //     //         if (diffDays > 0 && diffDays <= 1) {
      //     //           this.selectedRanges.push({
      //     //             start: main_day,
      //     //             end: date,
      //     //           });
      //     //         } else {
      //     //           this.selectedRanges.push({ start: main_day, end: start });

      //     //           this.selectedRanges.push({ start: date, end: date });
      //     //         }
      //     //       }
      //     //     } else {
      //     //       this.selectedRanges.push({ start: date, end: date });
      //     //     }
      //     //   } else {
      //     //     if (main_day) {
      //     //       if (start) {
      //     //         const diffDays =
      //     //           (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

      //     //         if (diffDays > 1) {
      //     //           this.selectedRanges.push({
      //     //             start: main_day,
      //     //             end: start,
      //     //           });

      //     //           main_day = date;
      //     //         }
      //     //       }
      //     //     } else {
      //     //       main_day = date;
      //     //     }
      //     //     start = date;
      //     //   }
      //     // }
      //   });

      //   // await sortedData.forEach((item: any) => {
      //   //   const dateStr = new Date(item.holidaydate).toISOString().slice(0, 10);

      //   //   const idx = this.holidayDate.findIndex(
      //   //     (h) => h.date.toISOString().slice(0, 10) === dateStr,
      //   //   );

      //   //   if (idx !== -1) {
      //   //     this.holidayDate[idx].canTrade = item.can_trade || 'N';
      //   //     this.holidayDate[idx].description = item.description || null;
      //   //   }
      //   // });
      // } catch (err) {
      //   console.log(err);
      // }
    },

    cancelCopy() {
      this.status.dialogCopy = false;
      this.copy = {
        year: this.item.year + 1,
        market: this.item.market,
        holidayType: this.item.holidayType,
      };
    },

    handleImportExcel() {
      // const input = document.createElement("input");
      // input.type = "file";
      // input.accept = ".xlsx, .xls, .csv";
      // input.style.display = "none";
      // input.addEventListener("change", (event: Event) => {
      //   const target = event.target as HTMLInputElement;
      //   const file = target.files?.[0];
      //   if (!file) return;
      //   const reader = new FileReader();
      //   reader.onload = async (e: ProgressEvent<FileReader>) => {
      //     const result = e.target?.result;
      //     if (!result) return;
      //     const data = new Uint8Array(result as ArrayBuffer);
      //     const workbook = XLSX.read(data, { type: "array" });
      //     const sheetName = workbook.SheetNames[0];
      //     if (!sheetName) return;
      //     const worksheet = workbook.Sheets[sheetName];
      //     if (!worksheet) return;
      //     const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(
      //       worksheet,
      //       { defval: "", raw: false }
      //     );
      //     // do 1, 1, 2, 3 => 1, 2, 3
      //     const uniqueData = await jsonData.filter((item, index, self) => {
      //       const dateStr = new Date(item.holidaydate)
      //         .toISOString()
      //         .slice(0, 10);
      //       return (
      //         self.findIndex(
      //           (i) =>
      //             new Date(i.holidaydate).toISOString().slice(0, 10) === dateStr
      //         ) === index
      //       );
      //     });
      //     //do 1, 3, 2 => 1, 2, 3
      //     const sortedData = await uniqueData.sort(
      //       (item1, item2) =>
      //         new Date(item1.holidaydate).getTime() -
      //         new Date(item2.holidaydate).getTime()
      //     );
      //     //do now = 3, all 1, 2, 3, 4, 5 => {start: 3, end: 4}
      //     let main_day = null as Date | null;
      //     let start = null as Date | null;
      //     await sortedData.forEach((item: any, index: number) => {
      //       const date = new Date(item.holidaydate);
      //       const diffDays_3 =
      //         (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
      //       if (diffDays_3 >= 3) {
      //         if (index === sortedData.length - 1) {
      //           if (main_day) {
      //             if (start) {
      //               const diffDays =
      //                 (date.getTime() - start.getTime()) /
      //                 (1000 * 60 * 60 * 24);
      //               if (diffDays > 0 && diffDays <= 1) {
      //                 this.selectedRanges.push({
      //                   start: main_day,
      //                   end: date,
      //                 });
      //               } else {
      //                 this.selectedRanges.push({ start: main_day, end: start });
      //                 this.selectedRanges.push({ start: date, end: date });
      //               }
      //             }
      //           } else {
      //             this.selectedRanges.push({ start: date, end: date });
      //           }
      //         } else {
      //           if (main_day) {
      //             if (start) {
      //               const diffDays =
      //                 (date.getTime() - start.getTime()) /
      //                 (1000 * 60 * 60 * 24);
      //               if (diffDays > 1) {
      //                 this.selectedRanges.push({
      //                   start: main_day,
      //                   end: start,
      //                 });
      //                 main_day = date;
      //               }
      //             }
      //           } else {
      //             main_day = date;
      //           }
      //           start = date;
      //         }
      //       }
      //     });
      //     //do day: 3, can trade: null => day: 3, can trade: N
      //     await sortedData.forEach((item: any) => {
      //       const dateStr = new Date(item.holidaydate)
      //         .toISOString()
      //         .slice(0, 10);
      //       const idx = this.holidayDate.findIndex(
      //         (h) => h.date.toISOString().slice(0, 10) === dateStr
      //       );
      //       if (idx !== -1) {
      //         this.holidayDate[idx].canTrade = item.can_trade || "N";
      //         this.holidayDate[idx].description = item.description || null;
      //       }
      //     });
      //   };
      //   reader.readAsArrayBuffer(file);
      // });
      // input.click();
    },

    onExport() {
      const dataWS = XLSX.utils.json_to_sheet(
        this.holidayDate.map((item) => {
          return {
            calendar_name:
              this.item.holidayType === "local" ? "TH-MARKET" : "US-MARKET",
            exchange_code: this.item.market,
            holidaydate: item.date,
            description: item.description || "",
            can_trade: item.canTrade,
          };
        })
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, dataWS, "Holiday");
      XLSX.writeFile(wb, `SetUpHoliday_${this.item.year}.csv`, {
        bookType: "csv",
      });
    },

    async insertHoliday() {
      // try {
      //   const response = await $fetch<any>("/api/holiday/insert", {
      //     method: "POST",
      //     headers: {
      //       sessionid: useSessionStore().$state.sessionid!,
      //     },
      //     body: {
      //       lists: this.holidayDate.map((item) => {
      //         return {
      //           calendarname:
      //             this.item.holidayType === "local" ? "TH-MARKET" : "US-MARKET",
      //           exchangecode: this.item.market,
      //           holidaydate: this.formatDate(item.date),
      //           description: item.description || "",
      //           cantrade: item.canTrade,
      //           halfdayflag: item.canTrade === "X" ? "Y" : "N",
      //         };
      //       }),
      //     },
      //   });
      //   if (response.result === "Y") {
      //     this.status.confirm = true;
      //     this.status.warning = true;
      //     this.status.warningTitle = "Success";
      //     this.status.warningMessage = "Holiday inserted successfully.";
      //   } else {
      //     this.status.warning = true;
      //     this.status.warningTitle = "Warning";
      //     this.status.warningMessage = response.reason;
      //   }
      // } catch (err) {
      //   console.error("Error inserting holiday:", err);
      // }
    },

    async copyInsertHoliday() {
      // try {
      //   this.status.loading = true;
      //   const response = await $fetch<any>("/api/holiday/insert", {
      //     method: "POST",
      //     headers: {
      //       sessionid: useSessionStore().$state.sessionid!,
      //     },
      //     body: {
      //       lists: this.holidayDate.map((item) => {
      //         return {
      //           calendarname:
      //             this.item.holidayType === "local" ? "TH-MARKET" : "US-MARKET",
      //           exchangecode: this.item.market,
      //           holidaydate: this.formatDate(item.date, this.copy.year),
      //           description: item.description || "",
      //           cantrade: item.canTrade,
      //           halfdayflag: item.canTrade === "X" ? "Y" : "N",
      //         };
      //       }),
      //     },
      //   });
      //   this.status.loading = false;
      //   this.status.dialogCopy = false;
      //   if (response.result === "Y") {
      //     this.status.warning = true;
      //     this.status.warningTitle = "Success";
      //     this.status.warningMessage = "Holiday copied successfully.";
      //   } else {
      //     this.status.warning = true;
      //     this.status.warningTitle = "Warning";
      //     this.status.warningMessage = response.reason;
      //   }
      // } catch (err) {
      //   console.error("Error inserting holiday:", err);
      // }
    },
  },
  watch: {
    selectedRanges: {
      handler() {
        this.allSelectedDates();
      },
      deep: true,
    },
  },
};
</script>

<style>
.vc-container .vc-weekday-1,
.vc-container .vc-weekday-7 {
  color: #db4345;
}
.vc-header .vc-title {
  pointer-events: none;
}
</style>
