<template>
    <!-- <Calendar /> -->
    <v-container>
        <v-row>
            <v-col cols="12" md="4" align="center">
                <v-number-input
                    density="comfortable"
                    v-model="search.year"
                    label="Year"
                    variant="outlined"
                    :min="0"
                ></v-number-input>
            </v-col>
            <v-col cols="12" md="4" align="center">
                <v-text-field
                    density="comfortable"
                    v-model="market"
                    label="Market"
                    variant="outlined"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
                <v-btn size="large" variant="outlined" @click="searchClick" block>Search</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-radio-group v-model="search.holidayType" inline>
                    <v-radio label="Local" value="local"></v-radio>
                    <v-radio label="Global" value="global"></v-radio>
                </v-radio-group>
            </v-col>
        </v-row>
        <Calendar v-if="!holidayType"
        :rows="3" :columns="4" 
        :initial-page="{ month: 1, year: year }"/>
        
        <DatePicker v-else
        v-model.range="date"
        :rows="3" :columns="4" 
        :initial-page="{ month: 1, year: year }" 
        :key="year"
        :attributes="rangeAttributes"
        :disabled-dates="disabledDates"
        :is-range="false"
        is-expanded
        @dayclick="handleDayClick"/>

         <v-row></v-row>
     </v-container>
</template>

<script lang="ts">
    interface Range {
        start: Date | null
        end: Date | null
    }
    import { Calendar, DatePicker } from 'v-calendar';
    import 'v-calendar/style.css';

    export default {
        components: {
            Calendar,
            DatePicker
        },
        computed: {
            // highlightedDates() {
            // return [
            //     {
            //         key: 'range-1',
            //         highlight: 'blue',
            //         dates: { start: new Date(`${this.year}-01-10`), end: new Date(`${this.year}-01-20`) },
            //     },
            //     {
            //         key: 'range-2',
            //         highlight: 'green',
            //         dates: { start: new Date(`${this.year}-04-01`), end: new Date(`${this.year}-04-10`) },
            //     },
            //     {
            //         key: 'range-3',
            //         highlight: 'red',
            //         dates: { start: new Date(`${this.year}-09-05`), end: new Date(`${this.year}-09-15`) },
            //     },
            // ]
            // }
            rangeAttributes() {
                return this.selectedRanges.map((range, i) => ({
                    key: `range-${i}`,
                    highlight: 'green',
                    dates: {
                        start: range.start ? new Date(range.start) : undefined,
                        end: range.end ? new Date(range.end) : undefined
                    }
                }));
            }
        },
        data() {
            const now = new Date()
            return {
                date: null as any | null,
                year: now.getFullYear(),
                market: 'NASDAQ',
                holidayType: null,
                selectedRanges: [] as Range[],
                tempRange: { start: null, end: null } as Range,
                disabledDates: [{
                    repeat: {
                        weekdays: [1, 7]
                    }
                }],

                search: {
                    year: now.getFullYear(),
                    market: 'NASDAQ',
                    holidayType: null,
                }
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.selectedRanges.push(
                    { start: new Date(`${this.year}-04-01`), end: new Date(`${this.year}-04-03`) },
                )
            },

            handleDayClick(day: any) {
                if (this.tempRange.start && !this.tempRange.end) {
                    if(day.weekday !== 1 && day.weekday !== 7) {
                        const start = this.tempRange.start
                        const diffDays = (day.date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
                        if(diffDays >= 0 && diffDays <= 2) {
                            const end = day.date
                            this.selectedRanges.push({ start, end })
                        }
                    }
                    this.tempRange = { start: null, end: null }
                    this.date = null
                }else {
                    if(day.weekday !== 1 && day.weekday !== 7) {
                        this.tempRange = { start: day.date, end: null }
                    }
                }
            },

            searchClick() {
                this.year = this.search.year;
                this.market = this.search.market;
                this.holidayType = this.search.holidayType;
            }
        }
    };
</script>

<style>
.vc-container .vc-weekday-1, .vc-container .vc-weekday-7 {
  color: #DB4345;
}
</style>